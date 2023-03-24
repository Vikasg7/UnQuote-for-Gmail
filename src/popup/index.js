globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])

// Manipulating button text
const btn = document.querySelector(".toggle .fa-solid")

if (isExtEnabled) {
   btn.className = "fa-solid fa-toggle-on"
} else {
   btn.className = "fa-solid fa-toggle-off"
}

// Adding onClick Handler for Toggling Enable or disable
async function onBtnClick () {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   if (isExtEnabled) {
      chrome.storage.sync.set({ isExtEnabled: false })
      btn.className = "fa-solid fa-toggle-off"
   } else {
      chrome.storage.sync.set({ isExtEnabled: true })
      btn.className = "fa-solid fa-toggle-on"
   }
}

btn.addEventListener("click", onBtnClick)