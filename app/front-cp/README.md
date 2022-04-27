# HTM frontend application

## I18n

ASM_BUILD_DEFAULT_LOCALE
ASM_BUILD_SUPPORTED_LOCALES

## Translation

All translation are in `locales` directory.

## Manifest

You can change the default values in `manifest/config.json` such as color.

### Icons

You will need this these application for edit and create optimized icons for your application:

```bash
# install tools
sudo apt-get install inkscape imagemagick pngquant
```

1. Modify icon using Inkscape in `manifest/logo.svg`.
2. Optimize SVG icon using svgo `./node_modules/.bin/svgo ./manifest/logo.svg`.
3. Export 1024x1024 to `manifest/logo.png` using Inkscape.
4. Optimize PNG icon using `pngquant --quality 0-1 --force --speed 1 ./manifest/logo.png --output ./manifest/logo.png`
5. Run `./manifest/build-icons.js`
