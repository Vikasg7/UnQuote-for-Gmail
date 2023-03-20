@echo off
@REM Chrome
rm -r dist/chrome/{assets,lib} dist/chrome.zip
cp -ru -t dist/chrome src/{assets,background,cs,lib,popup}
cp -u src/manifest/chrome.json dist/chrome/manifest.json
cd dist/chrome && zip -rq ../chrome.zip * && cd ../..

@REM Firefox
rm -r dist/firefox/{assets,lib} dist/firefox.zip
cp -ru -t dist/firefox src/{assets,background,cs,lib,popup}
cp -u src/manifest/firefox.json dist/firefox/manifest.json
cd dist/firefox && zip -rq ../firefox.zip * && cd ../../
