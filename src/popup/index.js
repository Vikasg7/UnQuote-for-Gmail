globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])

// Manipulating button text
const btn = document.getElementsByClassName("btn").item(0)

if (isExtEnabled) {
   btn.innerText = "Click here to Disable"
} else {
   btn.innerText = "Click here to Enable"
}

// Adding onClick Handler for Toggling Enable or disable
async function onBtnClick () {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   if (isExtEnabled) {
      chrome.storage.sync.set({ isExtEnabled: false })
      btn.innerText = "Click here to Enable"
   } else {
      chrome.storage.sync.set({ isExtEnabled: true })
      btn.innerText = "Click here to Disable"
   }
}

btn.addEventListener("click", onBtnClick)