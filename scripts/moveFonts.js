const fs = require('fs');
const path = require('path');
const os = require('os');
const glob = require('glob');

const projectRoot = process.cwd();
const FONTS_DIR = path.join(projectRoot, 'src', 'assets', 'fonts');

function findExpoFontsDirectory() {
  const isMac = os.platform() === 'darwin';
  const isWindows = os.platform() === 'win32';
  let fontsPath = null;

  if (isMac) {
    const simulatorPath = path.join(os.homedir(), 'Library/Developer/CoreSimulator/Devices');
    const pattern = `${simulatorPath}/**/Documents/ExponentExperienceData/**/fonts`;
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  } else if (isWindows) {
    // Android emulator path on Windows
    const androidPath = path.join(os.homedir(), 'AppData/Local/Android/Sdk');
    const pattern = `${androidPath}/**/data/data/**/files/fonts`;
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  } else {
    // Linux Android emulator path
    const androidPath = path.join(os.homedir(), 'Android/Sdk');
    const pattern = `${androidPath}/**/data/data/**/files/fonts`;
    const paths = glob.sync(pattern);
    fontsPath = paths[0];
  }

  return fontsPath;
}

function copyFonts() {
  // Create fonts directory if it doesn't exist
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  const fontsPath = findExpoFontsDirectory();

  if (!fontsPath) {
    console.error('Could not find Expo fonts directory. Make sure your app has been run at least once.');
    return;
  }

  try {
    const fontFiles = fs.readdirSync(fontsPath);
    let copiedCount = 0;

    fontFiles.forEach((fontFile) => {
      if (fontFile.endsWith('.ttf') || fontFile.endsWith('.woff2') || fontFile.endsWith('.woff')) {
        const src = path.join(fontsPath, fontFile);
        const dest = path.join(FONTS_DIR, fontFile.replace(/\.(woff2|woff)$/, '.ttf'));
        
        fs.copyFileSync(src, dest);
        copiedCount++;
        console.log(`Copied ${fontFile} to ${dest}`);
      }
    });

    if (copiedCount === 0) {
      console.log('No font files found to copy.');
    } else {
      console.log(`\nSuccessfully copied ${copiedCount} font files to ${FONTS_DIR}`);
      console.log('\nMake sure to add the following to your app.json:');
      console.log(`
{
  "expo": {
    "assetBundlePatterns": [
      "**/*",
      "src/assets/fonts/*"
    ]
  }
}`);
    }
  } catch (error) {
    console.error('Error copying fonts:', error);
  }
}

copyFonts();