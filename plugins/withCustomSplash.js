const { withAndroidStyles, withAndroidColors, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withCustomSplash = (config) => {
  // 1. Modify styles.xml so Theme.App.SplashScreen uses activityBackground (#05050C) instead of splashscreen_logo
  config = withAndroidStyles(config, (config) => {
    const styles = config.modResults;
    if (styles?.resources?.style) {
      for (const style of styles.resources.style) {
        if (style.$?.name === 'Theme.App.SplashScreen') {
          if (Array.isArray(style.item)) {
            for (const item of style.item) {
              if (item.$?.name === 'android:windowBackground') {
                item._ = '@color/activityBackground';
              }
            }
          }
        }
      }
    }
    return config;
  });

  // 2. Set splashscreen_background to dark background #05050C in colors.xml
  config = withAndroidColors(config, (config) => {
    const colors = config.modResults;
    if (colors?.resources?.color) {
      for (const color of colors.resources.color) {
        if (color.$?.name === 'splashscreen_background') {
          color._ = '#05050C';
        }
      }
    }
    return config;
  });

  // 3. Overwrite any generated splashscreen_logo.png with a transparent 1x1 png to ensure no stray logo can ever appear
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const resDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res');
      const transparentPixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        'base64'
      );
      const drawableDirs = ['drawable-hdpi', 'drawable-mdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi', 'drawable'];
      for (const dir of drawableDirs) {
        const logoPath = path.join(resDir, dir, 'splashscreen_logo.png');
        if (fs.existsSync(logoPath)) {
          fs.writeFileSync(logoPath, transparentPixel);
        }
      }
      return config;
    },
  ]);

  return config;
};

module.exports = withCustomSplash;
