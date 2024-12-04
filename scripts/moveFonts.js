const fs = require('fs');
const path = require('path');
const os = require('os');
const glob = require('glob');

const projectRoot = process.cwd();
const SRC_FONTS_DIR = path.join(projectRoot, 'src', 'assets', 'fonts');
const TOP_LEVEL_FONTS_DIR = path.join(projectRoot, 'assets', 'fonts');
const APP_JSON_PATH = path.join(projectRoot, 'app.json');
const APP_TSX_PATH = path.join(projectRoot, 'App.tsx');

console.log(`Project root: ${projectRoot}`);

function detectProjectStructure() {
  console.log('Step 1: Detecting project structure...');
  console.log(`Project root: ${projectRoot}`);
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
  console.log('Step 1 Complete: Project structure detected.');
}

function findExpoFontsDirectory() {
  console.log('Step 2: Locating Expo fonts directory...');
  const isMac = os.platform() === 'darwin';
  const isWindows = os.platform() === 'win32';
  let fontsPath = null;

  const customFontsDir = path.join(os.homedir(), '.expo-dynamic-fonts');
  console.log(`Checking for custom fonts directory: ${customFontsDir}`);
  if (fs.existsSync(customFontsDir)) {
    console.log(`Found custom fonts directory: ${customFontsDir}`);
    return customFontsDir;
  }

  if (isMac) {
    const simulatorPath = path.join(os.homedir(), 'Library/Developer/CoreSimulator/Devices');
    const pattern = `${simulatorPath}/**/Documents/ExponentExperienceData/**/.expo-dynamic-fonts`;
    console.log(`Searching for fonts on Mac with pattern: ${pattern}`);
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  } else if (isWindows) {
    const androidPath = path.join(os.homedir(), 'AppData/Local/Android/Sdk');
    const pattern = `${androidPath}/**/data/data/**/.expo-dynamic-fonts`;
    console.log(`Searching for fonts on Windows with pattern: ${pattern}`);
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  } else {
    const androidPath = path.join(os.homedir(), 'Android/Sdk');
    const pattern = `${androidPath}/**/data/data/**/.expo-dynamic-fonts`;
    console.log(`Searching for fonts on Linux with pattern: ${pattern}`);
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  }

  console.log('Step 2 Complete: Expo fonts directory located.');
  return fontsPath;
}

function updateAppTsx(fontFiles) {
  console.log('Step 3: Updating App.tsx with new font assets...');
  const appTsxPath = path.join(projectRoot, 'App.tsx');
  let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');

  const loadFontsRegex = /const loadFonts = async \(\) => \{[\s\S]*?\};/;
  const loadFontsMatch = appTsxContent.match(loadFontsRegex);

  if (!loadFontsMatch) {
    console.error('Could not find loadFonts function');
    return;
  }

  let loadFontsContent = loadFontsMatch[0];
  console.log('Found loadFonts function content:', loadFontsContent);

  const lastTtfIndex = loadFontsContent.lastIndexOf('.ttf');

  if (lastTtfIndex === -1) {
    console.error('Could not find any .ttf entries in loadFonts function');
    return;
  }

  console.log(`Last .ttf index: ${lastTtfIndex}`);

  const insertPosition = loadFontsContent.indexOf('\n', lastTtfIndex);
  
  if (insertPosition === -1) {
    console.error('Could not find appropriate position to insert new fonts');
    return;
  }

  console.log(`Insert position: ${insertPosition}`);

  const newFontEntries = fontFiles.map(file => {
    const fontName = path.basename(file, path.extname(file));
    return `      '${fontName}': require('./src/assets/fonts/${file}'),`;
  }).join('\n');

  console.log('New font entries:', newFontEntries);

  loadFontsContent = loadFontsContent.slice(0, insertPosition) + 
                     '\n' + newFontEntries +
                     loadFontsContent.slice(insertPosition);

  console.log('Updated loadFonts content:', loadFontsContent);

  appTsxContent = appTsxContent.replace(loadFontsRegex, loadFontsContent);

  console.log('Writing updated App.tsx content');
  fs.writeFileSync(appTsxPath, appTsxContent);
  console.log('Step 3 Complete: App.tsx updated.');
}

function updateAppJson(fontFiles, structure) {
  console.log('Step 4: Updating app.json with new font assets...');
  
  if (!fs.existsSync(APP_JSON_PATH)) {
    console.error('app.json not found');
    return;
  }

  let appJsonContent = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
  console.log('Successfully read app.json');

  if (!appJsonContent.expo) appJsonContent.expo = {};

  if (!appJsonContent.expo.assetBundlePatterns) {
    appJsonContent.expo.assetBundlePatterns = [];
  }

  const patterns = structure === 'src' ? ["**/*", "src/assets/fonts/*"] : ["**/*", "assets/fonts/*"];
  patterns.forEach(pattern => {
    if (!appJsonContent.expo.assetBundlePatterns.includes(pattern)) {
      appJsonContent.expo.assetBundlePatterns.push(pattern);
      console.log(`Added ${pattern} to assetBundlePatterns`);
    }
  });

  if (structure === 'top-level') {
    if (!appJsonContent.expo.plugins) {
      appJsonContent.expo.plugins = [];
    }

    const expoFontPlugin = appJsonContent.expo.plugins.find(plugin => 
      Array.isArray(plugin) && plugin[0] === 'expo-font'
    );

    if (!expoFontPlugin) {
      appJsonContent.expo.plugins.push(['expo-font', { fonts: [] }]);
      console.log('Added expo-font plugin to app.json');
    }

    const fontPluginIndex = appJsonContent.expo.plugins.findIndex(plugin => 
      Array.isArray(plugin) && plugin[0] === 'expo-font'
    );

    fontFiles.forEach(file => {
      const fontPath = `./assets/fonts/${file}`;
      if (!appJsonContent.expo.plugins[fontPluginIndex][1].fonts.includes(fontPath)) {
        appJsonContent.expo.plugins[fontPluginIndex][1].fonts.push(fontPath);
        console.log(`Added ${fontPath} to expo-font plugin`);
      }
    });
  }

  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJsonContent, null, 2));
  console.log('Step 4 Complete: app.json updated.');
}

function copyFonts() {
  console.log('Process Start: Copying fonts...');
  
  const structure = detectProjectStructure();
  console.log(`Detected project structure: ${structure}`);

  if (structure === 'unknown') {
    console.error('Unknown project structure. Please set up your fonts directory.');
    return;
  }

  const targetDir = structure === 'src' ? SRC_FONTS_DIR : TOP_LEVEL_FONTS_DIR;

  if (!fs.existsSync(targetDir)) {
    console.log(`Creating fonts directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fontsPath = findExpoFontsDirectory();

  if (!fontsPath) {
    console.error('Could not find Expo fonts directory. Make sure your app has been run at least once.');
    return;
  }

  try {
    console.log(`Reading font files from: ${fontsPath}`);
    const fontFiles = fs.readdirSync(fontsPath);
    console.log(`Found font files: ${fontFiles.join(', ')}`);
    
    const newFontFiles = fontFiles.filter(file => {
      const destPath = path.join(targetDir, file.replace(/\.(woff2|woff)$/, '.ttf'));
      return !fs.existsSync(destPath);
    });

    if (newFontFiles.length === 0) {
      console.log('No new font files found to copy. Exiting.');
      return;
    }

    let copiedCount = 0;
    let copiedFontFiles = [];

    newFontFiles.forEach((fontFile) => {
      if (fontFile.endsWith('.ttf') || fontFile.endsWith('.woff2') || fontFile.endsWith('.woff')) {
        const src = path.join(fontsPath, fontFile);
        const dest = path.join(targetDir, fontFile.replace(/\.(woff2|woff)$/, '.ttf'));
        
        console.log(`Copying font file from ${src} to ${dest}`);
        fs.copyFileSync(src, dest);
        copiedCount++;
        copiedFontFiles.push(fontFile.replace(/\.(woff2|woff)$/, '.ttf'));
        console.log(`Copied ${fontFile} to ${dest}`);
      }
    });

    if (copiedCount === 0) {
      console.log('No font files were copied.');
    } else {
      console.log(`Successfully copied ${copiedCount} font files to ${targetDir}`);
      console.log(`Copied font files: ${copiedFontFiles.join(', ')}`);
      if (structure === 'src') {
        updateAppTsx(copiedFontFiles);
      }
      updateAppJson(copiedFontFiles, structure);
    }
  } catch (error) {
    console.error('Error copying fonts:', error);
  }
  console.log('Process Complete: Fonts copied successfully.');
}

function clearCachedFonts() {
  console.log('Process Start: Clearing cached fonts...');
  const fontsPath = findExpoFontsDirectory();
  const projectFontsPath = path.join(projectRoot, 'src', 'assets', 'fonts');

  if (!fontsPath) {
    console.error('Could not find Expo fonts directory. No cached fonts to clear.');
    return;
  }

  let cachedFontFiles = [];

  try {
    cachedFontFiles = fs.readdirSync(fontsPath);
    console.log(`Found ${cachedFontFiles.length} cached font files to remove`);

    cachedFontFiles.forEach((file) => {
      const cachedFilePath = path.join(fontsPath, file);
      const projectFilePath = path.join(projectFontsPath, file);

      fs.unlinkSync(cachedFilePath);
      console.log(`Removed cached font file: ${cachedFilePath}`);

      if (fs.existsSync(projectFilePath)) {
        fs.unlinkSync(projectFilePath);
        console.log(`Removed project font file: ${projectFilePath}`);
      }
    });

    console.log('Successfully cleared all cached fonts');
  } catch (error) {
    console.error('Error clearing cached fonts:', error);
  }

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
        appTsxContent = appTsxContent.replace(loadFontsRegex, '');
      }

      fs.writeFileSync(appTsxPath, appTsxContent);
      console.log('Successfully updated App.tsx to remove cached fonts');
    }
  } catch (error) {
    console.error('Error updating App.tsx:', error);
  }

  console.log('Process Complete: Cached fonts cleared.');
}

const args = process.argv.slice(2);

if (args.includes('--clear-cache')) {
  clearCachedFonts();
} else {
  copyFonts();
}