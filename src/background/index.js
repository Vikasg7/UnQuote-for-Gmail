globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

async function setInitialState() {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   if (!isExtEnabled) await chrome.storage.sync.set({ isExtEnabled: true })
}

async function handleInstall() {
   await setInitialState()
}
   
// Must register listeners synchronously at global scope of SW or else they won't work
chrome.runtime.onInstalled.addListener(handleInstall)