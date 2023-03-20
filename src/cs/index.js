globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

async function main() {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   console.log("isExtEnabled", isExtEnabled)
}

main()
