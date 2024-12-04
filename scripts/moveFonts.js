const fs = require('fs');
const path = require('path');
const os = require('os');
const glob = require('glob');

const projectRoot = process.cwd();
const SRC_FONTS_DIR = path.join(projectRoot, 'src', 'assets', 'fonts');
const TOP_LEVEL_FONTS_DIR = path.join(projectRoot, 'assets', 'fonts');
const APP_JSON_PATH = path.join(projectRoot, 'app.json');
const APP_TSX_PATH = path.join(projectRoot, 'App.tsx');

console.log(`[DEBUG] Project root: ${projectRoot}`);

function detectProjectStructure() {
  const hasSrcFonts = fs.existsSync(SRC_FONTS_DIR);
  const hasTopLevelFonts = fs.existsSync(TOP_LEVEL_FONTS_DIR);
  const hasAppTsx = fs.existsSync(APP_TSX_PATH);

  if (hasSrcFonts && hasAppTsx) {
    return 'src';
  } else if (hasTopLevelFonts) {
    return 'top-level';
  } else {
    return 'unknown';
  }
}

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
  const loadFontsMatch = appTsxContent.match(loadFontsRegex);

  if (!loadFontsMatch) {
    console.error('[DEBUG] Could not find loadFonts function');
    return;
  }

  let loadFontsContent = loadFontsMatch[0];
  console.log('[DEBUG] Found loadFonts function content:', loadFontsContent);

  const lastTtfIndex = loadFontsContent.lastIndexOf('.ttf');

  if (lastTtfIndex === -1) {
    console.error('[DEBUG] Could not find any .ttf entries in loadFonts function');
    return;
  }

  console.log(`[DEBUG] Last .ttf index: ${lastTtfIndex}`);

  const insertPosition = loadFontsContent.indexOf('\n', lastTtfIndex);
  
  if (insertPosition === -1) {
    console.error('[DEBUG] Could not find appropriate position to insert new fonts');
    return;
  }

  console.log(`[DEBUG] Insert position: ${insertPosition}`);

  const newFontEntries = fontFiles.map(file => {
    const fontName = path.basename(file, path.extname(file));
    return `      '${fontName}': require('./src/assets/fonts/${file}'),`;
  }).join('\n');

  console.log('[DEBUG] New font entries:', newFontEntries);

  loadFontsContent = loadFontsContent.slice(0, insertPosition) + 
                     '\n' + newFontEntries +
                     loadFontsContent.slice(insertPosition);

  console.log('[DEBUG] Updated loadFonts content:', loadFontsContent);

  appTsxContent = appTsxContent.replace(loadFontsRegex, loadFontsContent);

  console.log('[DEBUG] Writing updated App.tsx content');
  fs.writeFileSync(appTsxPath, appTsxContent);
  console.log('[DEBUG] Updated App.tsx with new font assets');
}

function updateAppJson(fontFiles, structure) {
  console.log('[DEBUG] Starting updateAppJson');
  
  if (!fs.existsSync(APP_JSON_PATH)) {
    console.error('[DEBUG] app.json not found');
    return;
  }

  let appJsonContent = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
  console.log('[DEBUG] Successfully read app.json');

  if (!appJsonContent.expo) appJsonContent.expo = {};

  // Update assetBundlePatterns
  if (!appJsonContent.expo.assetBundlePatterns) {
    appJsonContent.expo.assetBundlePatterns = [];
  }

  const patterns = structure === 'src' ? ["**/*", "src/assets/fonts/*"] : ["**/*", "assets/fonts/*"];
  patterns.forEach(pattern => {
    if (!appJsonContent.expo.assetBundlePatterns.includes(pattern)) {
      appJsonContent.expo.assetBundlePatterns.push(pattern);
      console.log(`[DEBUG] Added ${pattern} to assetBundlePatterns`);
    }
  });

  // Update expo-font plugin for top-level structure
  if (structure === 'top-level') {
    if (!appJsonContent.expo.plugins) {
      appJsonContent.expo.plugins = [];
    }

    const expoFontPlugin = appJsonContent.expo.plugins.find(plugin => 
      Array.isArray(plugin) && plugin[0] === 'expo-font'
    );

    if (!expoFontPlugin) {
      appJsonContent.expo.plugins.push(['expo-font', { fonts: [] }]);
      console.log('[DEBUG] Added expo-font plugin to app.json');
    }

    const fontPluginIndex = appJsonContent.expo.plugins.findIndex(plugin => 
      Array.isArray(plugin) && plugin[0] === 'expo-font'
    );

    fontFiles.forEach(file => {
      const fontPath = `./assets/fonts/${file}`;
      if (!appJsonContent.expo.plugins[fontPluginIndex][1].fonts.includes(fontPath)) {
        appJsonContent.expo.plugins[fontPluginIndex][1].fonts.push(fontPath);
        console.log(`[DEBUG] Added ${fontPath} to expo-font plugin`);
      }
    });
  }

  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJsonContent, null, 2));
  console.log('[DEBUG] Successfully updated app.json');
}

function copyFonts() {
  console.log('[DEBUG] Starting copyFonts');
  
  const structure = detectProjectStructure();
  console.log(`[DEBUG] Detected project structure: ${structure}`);

  if (structure === 'unknown') {
    console.error('[DEBUG] Unknown project structure. Please set up your fonts directory.');
    return;
  }

  const targetDir = structure === 'src' ? SRC_FONTS_DIR : TOP_LEVEL_FONTS_DIR;

  if (!fs.existsSync(targetDir)) {
    console.log(`[DEBUG] Creating fonts directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
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
      const destPath = path.join(targetDir, file.replace(/\.(woff2|woff)$/, '.ttf'));
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
        const dest = path.join(targetDir, fontFile.replace(/\.(woff2|woff)$/, '.ttf'));
        
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
      console.log(`[DEBUG] Successfully copied ${copiedCount} font files to ${targetDir}`);
      console.log(`[DEBUG] Copied font files: ${copiedFontFiles.join(', ')}`);
      if (structure === 'src') {
        updateAppTsx(copiedFontFiles);
      }
      updateAppJson(copiedFontFiles, structure);
    }
  } catch (error) {
    console.error('[DEBUG] Error copying fonts:', error);
  }
}

function clearCachedFonts() {
  console.log('[DEBUG] Starting clearCachedFonts');
  const fontsPath = findExpoFontsDirectory();
  const projectFontsPath = path.join(projectRoot, 'src', 'assets', 'fonts');

  if (!fontsPath) {
    console.error('[DEBUG] Could not find Expo fonts directory. No cached fonts to clear.');
    return;
  }

  let cachedFontFiles = [];

  try {
    cachedFontFiles = fs.readdirSync(fontsPath);
    console.log(`[DEBUG] Found ${cachedFontFiles.length} cached font files to remove`);

    cachedFontFiles.forEach((file) => {
      const cachedFilePath = path.join(fontsPath, file);
      const projectFilePath = path.join(projectFontsPath, file);

      // Remove from cache
      fs.unlinkSync(cachedFilePath);
      console.log(`[DEBUG] Removed cached font file: ${cachedFilePath}`);

      // Remove from project assets if it exists
      if (fs.existsSync(projectFilePath)) {
        fs.unlinkSync(projectFilePath);
        console.log(`[DEBUG] Removed project font file: ${projectFilePath}`);
      }
    });

    console.log('[DEBUG] Successfully cleared all cached fonts');
  } catch (error) {
    console.error('[DEBUG] Error clearing cached fonts:', error);
  }

  // Update App.tsx to remove only the cached fonts
  const appTsxPath = path.join(projectRoot, 'App.tsx');
  try {
    let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    const loadFontsRegex = /const loadFonts = async \(\) => \{[\s\S]*?\};/;
    const existingLoadFonts = appTsxContent.match(loadFontsRegex);

    if (existingLoadFonts) {
      const updatedLoadFonts = existingLoadFonts[0].split('\n').filter(line => {
        const fontName = line.match(/'([^']+)':/);
        return !fontName || !cachedFontFiles.includes(`${fontName[1]}.ttf`);
      }).join('\n');

      if (updatedLoadFonts.includes('await Font.loadAsync({')) {
        appTsxContent = appTsxContent.replace(loadFontsRegex, updatedLoadFonts);
      } else {
        // If all fonts were removed, remove the entire loadFonts function
        appTsxContent = appTsxContent.replace(loadFontsRegex, '');
      }

      fs.writeFileSync(appTsxPath, appTsxContent);
      console.log('[DEBUG] Successfully updated App.tsx to remove cached fonts');
    }
  } catch (error) {
    console.error('[DEBUG] Error updating App.tsx:', error);
  }

  console.log('[DEBUG] Finished clearing cached fonts and updating App.tsx');
}

const args = process.argv.slice(2);

if (args.includes('--clear-cache')) {
  clearCachedFonts();
} else {
  copyFonts();
}