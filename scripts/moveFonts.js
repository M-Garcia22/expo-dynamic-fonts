const fs = require('fs');
const path = require('path');
const os = require('os');
const glob = require('glob');

const projectRoot = process.cwd();
const FONTS_DIR = path.join(projectRoot, 'src', 'assets', 'fonts');
const APP_JSON_PATH = path.join(projectRoot, 'app.json');

console.log(`[DEBUG] Project root: ${projectRoot}`);
console.log(`[DEBUG] Fonts directory: ${FONTS_DIR}`);
console.log(`[DEBUG] app.json path: ${APP_JSON_PATH}`);

function findExpoFontsDirectory() {
  console.log('[DEBUG] Starting findExpoFontsDirectory');
  const isMac = os.platform() === 'darwin';
  const isWindows = os.platform() === 'win32';
  let fontsPath = null;

  console.log(`[DEBUG] Operating system: ${os.platform()}`);

  // Check for the new .expo-dynamic-fonts directory
  const customFontsDir = path.join(os.homedir(), '.expo-dynamic-fonts');
  console.log(`[DEBUG] Checking for custom fonts directory: ${customFontsDir}`);
  if (fs.existsSync(customFontsDir)) {
    console.log(`[DEBUG] Found custom fonts directory: ${customFontsDir}`);
    return customFontsDir;
  }

  if (isMac) {
    const simulatorPath = path.join(os.homedir(), 'Library/Developer/CoreSimulator/Devices');
    const pattern = `${simulatorPath}/**/Documents/ExponentExperienceData/**/.expo-dynamic-fonts`;
    console.log(`[DEBUG] Searching for fonts on Mac with pattern: ${pattern}`);
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  } else if (isWindows) {
    const androidPath = path.join(os.homedir(), 'AppData/Local/Android/Sdk');
    const pattern = `${androidPath}/**/data/data/**/.expo-dynamic-fonts`;
    console.log(`[DEBUG] Searching for fonts on Windows with pattern: ${pattern}`);
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  } else {
    const androidPath = path.join(os.homedir(), 'Android/Sdk');
    const pattern = `${androidPath}/**/data/data/**/.expo-dynamic-fonts`;
    console.log(`[DEBUG] Searching for fonts on Linux with pattern: ${pattern}`);
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  }

  console.log(`[DEBUG] Found fonts path: ${fontsPath}`);
  return fontsPath;
}

function updateAppTsx(fontFiles) {
  console.log('[DEBUG] Starting updateAppTsx');
  const appTsxPath = path.join(projectRoot, 'App.tsx');
  console.log(`[DEBUG] App.tsx path: ${appTsxPath}`);
  let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

  const loadFontsRegex = /const loadFonts = async \(\) => \{[\s\S]*?\};/;
  const existingLoadFonts = appTsxContent.match(loadFontsRegex);

  if (fontFiles.length === 0 && !existingLoadFonts) {
    console.log('[DEBUG] No fonts to add and no existing loadFonts function. Skipping update.');
    return;
  }

  if (existingLoadFonts) {
    console.log('[DEBUG] Found existing loadFonts function');
    const existingFontsRegex = /'([^']+)':\s*require\([^)]+\)/g;
    const existingFonts = [...existingLoadFonts[0].matchAll(existingFontsRegex)].map(match => match[1]);
    console.log(`[DEBUG] Existing fonts: ${existingFonts.join(', ')}`);

    const newFontEntries = fontFiles.map(file => {
      const fontName = path.basename(file, path.extname(file));
      return `'${fontName}': require('./src/assets/fonts/${file}')`;
    });
    console.log(`[DEBUG] New font entries: ${newFontEntries.join(', ')}`);

    const combinedFonts = [...new Set([...existingFonts, ...newFontEntries.map(entry => entry.split(':')[0].replace(/'/g, ''))])];
    console.log(`[DEBUG] Combined fonts: ${combinedFonts.join(', ')}`);

    const newLoadFonts = `const loadFonts = async () => {
    await Font.loadAsync({
${combinedFonts.map(font => {
        const existingEntry = existingFonts.includes(font) ? 
          existingLoadFonts[0].match(new RegExp(`'${font}':[^,]+`))[0] :
          newFontEntries.find(entry => entry.startsWith(`'${font}'`));
        return `      ${existingEntry || `'${font}': require('./src/assets/fonts/${font}.ttf')`}`;
      }).join(',\n')}
    });
    setFontsLoaded(true);
  };`;

    appTsxContent = appTsxContent.replace(loadFontsRegex, newLoadFonts);
  } else {
    console.log('[DEBUG] No existing loadFonts function found, creating new one');
    const newLoadFonts = `const loadFonts = async () => {
    await Font.loadAsync({
${fontFiles.map(file => {
        const fontName = path.basename(file, path.extname(file));
        return `      '${fontName}': require('./src/assets/fonts/${file}')`;
      }).join(',\n')}
    });
    setFontsLoaded(true);
  };`;

    // Find a suitable place to insert the new loadFonts function
    const insertPosition = appTsxContent.indexOf('function App()');
    if (insertPosition !== -1) {
      appTsxContent = appTsxContent.slice(0, insertPosition) + newLoadFonts + '\n\n' + appTsxContent.slice(insertPosition);
    } else {
      console.error('[DEBUG] Could not find a suitable place to insert loadFonts function');
      return;
    }
  }

  console.log('[DEBUG] Writing updated App.tsx content');
  fs.writeFileSync(appTsxPath, appTsxContent);
  console.log('[DEBUG] Updated App.tsx with new font assets while preserving existing fonts');
}

function updateAppJson() {
  console.log('[DEBUG] Starting updateAppJson');
  
  if (!fs.existsSync(APP_JSON_PATH)) {
    console.error('[DEBUG] app.json not found');
    return;
  }

  let appJsonContent;
  try {
    appJsonContent = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
    console.log('[DEBUG] Successfully read app.json');
  } catch (error) {
    console.error('[DEBUG] Error reading app.json:', error);
    return;
  }

  if (!appJsonContent.expo) {
    appJsonContent.expo = {};
    console.log('[DEBUG] Added expo object to app.json');
  }

  if (!appJsonContent.expo.assetBundlePatterns) {
    appJsonContent.expo.assetBundlePatterns = [];
    console.log('[DEBUG] Added assetBundlePatterns array to app.json');
  }

  const patterns = ["**/*", "src/assets/fonts/*"];
  let updated = false;

  patterns.forEach(pattern => {
    if (!appJsonContent.expo.assetBundlePatterns.includes(pattern)) {
      appJsonContent.expo.assetBundlePatterns.push(pattern);
      console.log(`[DEBUG] Added ${pattern} to assetBundlePatterns`);
      updated = true;
    }
  });

  if (updated) {
    try {
      fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJsonContent, null, 2));
      console.log('[DEBUG] Successfully updated app.json');
    } catch (error) {
      console.error('[DEBUG] Error writing to app.json:', error);
    }
  } else {
    console.log('[DEBUG] app.json already contains necessary assetBundlePatterns');
  }
}

function copyFonts() {
  console.log('[DEBUG] Starting copyFonts');
  if (!fs.existsSync(FONTS_DIR)) {
    console.log(`[DEBUG] Creating fonts directory: ${FONTS_DIR}`);
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  const fontsPath = findExpoFontsDirectory();

  if (!fontsPath) {
    console.error('[DEBUG] Could not find Expo fonts directory. Make sure your app has been run at least once.');
    return;
  }

  try {
    console.log(`[DEBUG] Reading font files from: ${fontsPath}`);
    const fontFiles = fs.readdirSync(fontsPath);
    console.log(`[DEBUG] Found font files: ${fontFiles.join(', ')}`);
    
    const newFontFiles = fontFiles.filter(file => {
      const destPath = path.join(FONTS_DIR, file.replace(/\.(woff2|woff)$/, '.ttf'));
      return !fs.existsSync(destPath);
    });

    if (newFontFiles.length === 0) {
      console.log('[DEBUG] No new font files found to copy. Exiting.');
      return;
    }

    let copiedCount = 0;
    let copiedFontFiles = [];

    newFontFiles.forEach((fontFile) => {
      if (fontFile.endsWith('.ttf') || fontFile.endsWith('.woff2') || fontFile.endsWith('.woff')) {
        const src = path.join(fontsPath, fontFile);
        const dest = path.join(FONTS_DIR, fontFile.replace(/\.(woff2|woff)$/, '.ttf'));
        
        console.log(`[DEBUG] Copying font file from ${src} to ${dest}`);
        fs.copyFileSync(src, dest);
        copiedCount++;
        copiedFontFiles.push(fontFile.replace(/\.(woff2|woff)$/, '.ttf'));
        console.log(`[DEBUG] Copied ${fontFile} to ${dest}`);
      }
    });

    if (copiedCount === 0) {
      console.log('[DEBUG] No font files were copied.');
    } else {
      console.log(`[DEBUG] Successfully copied ${copiedCount} font files to ${FONTS_DIR}`);
      console.log(`[DEBUG] Copied font files: ${copiedFontFiles.join(', ')}`);
      updateAppTsx(copiedFontFiles);
      updateAppJson();
    }
  } catch (error) {
    console.error('[DEBUG] Error copying fonts:', error);
  }
}

copyFonts();