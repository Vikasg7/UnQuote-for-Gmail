globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

function getLastElement(selector, targetNode = document) {
   return Array.from(targetNode.querySelectorAll(selector)).pop()
}

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration * 1000))

const waitForElement = (selector, timeout, targetNode = document) => 
   new Promise((resolve) => {
      const element = getLastElement(selector, targetNode)
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
         const element = getLastElement(selector, targetNode)
         if (!element) return;
         clearTimeout(id)
         observer.disconnect()
         resolve(element)
      })
      
      const id = setTimeout(() => {
         observer.disconnect()
         resolve()
      }, timeout * 1000)

      observer.observe(targetNode, { childList: true, subtree: true })
   })

const click = (element) =>
   new Promise((resolve) => {
      const onClick = () => {
         element.removeEventListener("click", onClick)
         resolve(true)
      }
      element.addEventListener("click", onClick)
      element.click()
   })

const TRIM_BTN    = "div.ajR"
const QUOTES      = "div.ZyRVue div.gmail_quote"
const TIMEOUT_SEC = 5

const BUTTONS = {
   Reply: {
      selectors: ["div[data-tooltip='Reply']", "span.ams.bkH"],
      handler: async function onClick() {
         await removeQuotes()
         await addOnClickHandlerTo(["Send", "Discard"], BUTTONS)
      }
   },
   Forward: {
      selectors: ["span.ams.bkG"],
      handler: async function onClick() {
         await addOnClickHandlerTo(["Send", "Discard"], BUTTONS)
      }
   },
   Send: {
      selectors: ["div.aoO"],
      handler: async function onClick() {
         await addOnClickHandlerTo(["Reply", "Forward"], BUTTONS)
      }
   },
   Discard: {
      selectors: ["div.og"],
      handler: async function onClick() {
         await addOnClickHandlerTo(["Reply", "Forward"], BUTTONS)
      }
   }
}

async function removeQuotes() {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   if (!isExtEnabled) return;
   
   const trimBtn = await waitForElement(TRIM_BTN, TIMEOUT_SEC, getLastElement("div.gA.gt"))
   if (!trimBtn) return;
   await click(trimBtn)
   await sleep(0.5)

   let quotes = document.querySelector(QUOTES)
   // Sometimes quotes doesn't show up, so retrying after 2 seconds
   if (!quotes) {
      await sleep(2)
      await click(trimBtn)
      await sleep(0.5)
      quotes = document.querySelector(QUOTES)
      if (!quotes) return;
   }
   quotes.parentNode.removeChild(quotes);
}

async function addOnClickHandlerTo(btnTypes, BUTTONS) {
   btnTypes = Array.isArray(btnTypes) ? btnTypes : [btnTypes]
   for (const btnType of btnTypes) {
      for (const selector of BUTTONS[btnType].selectors) {
         const element = await waitForElement(selector, TIMEOUT_SEC)
         if (!element) {
            // console.info(`addOnClickHandlersTo: Couldn't find ${btnType} button`)
            continue
         };
         element.addEventListener("click", BUTTONS[btnType].handler)
         // console.info(`addOnClickHandlersTo: Added handler to ${btnType} button`)
      }
   }
}

async function main() {
   await addOnClickHandlerTo(["Reply", "Forward"], BUTTONS)
}

window.addEventListener("hashchange", main)

main()