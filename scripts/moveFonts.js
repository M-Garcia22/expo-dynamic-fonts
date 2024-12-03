const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the project root directory
const projectRoot = process.cwd();
const FONTS_DIR = path.join(projectRoot, 'src', 'assets', 'fonts');

// Function to copy files from the simulator/emulator to the project directory
function copyFonts() {
  const isMac = os.platform() === 'darwin';
  const isWindows = os.platform() === 'win32';

  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  if (isMac) {
    // For iOS simulator on macOS
    const simulatorFontsPath = path.join(
      os.homedir(),
      'Library/Developer/CoreSimulator/Devices'
    );

    try {
      const deviceDirs = fs.readdirSync(simulatorFontsPath);
      deviceDirs.forEach((deviceDir) => {
        const appPath = path.join(
          simulatorFontsPath,
          deviceDir,
          'data/Containers/Data/Application'
        );

        if (fs.existsSync(appPath)) {
          const appDirs = fs.readdirSync(appPath);
          appDirs.forEach((appDir) => {
            const fontsPath = path.join(
              appPath,
              appDir,
              'Documents/ExponentExperienceData/@anonymous/metals-depot-5d89fae5-d705-441c-84e3-a9920d12416f/fonts'
            );

            if (fs.existsSync(fontsPath)) {
              const fontFiles = fs.readdirSync(fontsPath);
              fontFiles.forEach((fontFile) => {
                const src = path.join(fontsPath, fontFile);
                const dest = path.join(FONTS_DIR, fontFile);
                fs.copyFileSync(src, dest);
                console.log(`Copied ${fontFile} to ${dest}`);
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Error copying fonts:', error);
    }
  } else if (isWindows) {
    // For Android emulator on Windows
    console.log('Please manually copy the font files from your Android emulator.');
  } else {
    // For Android emulator on Linux
    console.log('Please manually copy the font files from your Android emulator.');
  }
}

copyFonts();