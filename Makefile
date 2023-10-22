build: build-chrome build-firefox

build-chrome:
	rm -rf dist/chrome/*
	cp -ru -t dist/chrome src/assets src/background src/cs src/lib src/popup
	cp -u src/manifest/chrome.json dist/chrome/manifest.json
	cd dist/chrome && zip -rq ../chrome.zip * && cd ../../
	
build-firefox:
	rm -rf dist/firefox/*
	cp -ru -t dist/firefox src/assets src/background src/cs src/lib src/popup
	cp -u src/manifest/firefox.json dist/firefox/manifest.json
	cd dist/firefox && zip -rq ../firefox.zip * && cd ../../
