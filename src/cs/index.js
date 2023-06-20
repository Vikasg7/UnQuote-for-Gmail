globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

function getLastElement(selector, targetNode = document) {
   return Array.from(targetNode.querySelectorAll(selector)).pop()
}

function getFirstElement(selector, targetNode = document) {
   return targetNode.querySelector(selector)
}

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration * 1000))

const waitForElement = (selector, timeout, {targetNode = document, last = true} = {}) => 
   new Promise((resolve) => {
      const getElement = last ? getLastElement : getFirstElement
      const element = getElement(selector, targetNode)
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
         const element = getElement(selector, targetNode)
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
         element.click() // clicking twice to make sure, it is clicked.
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
      selectors: ["div[data-tooltip='Reply']", "span.ams.bkH", "span.ams.bkI"],
      handler: async function onClick() {
         await removeQuotes()
         addOnClickHandlerTo(["Send", "Discard"], BUTTONS)
      }
   },
   Forward: {
      selectors: ["span.ams.bkG"],
      handler: async function onClick() {
         await removeQuotes()
         addOnClickHandlerTo(["Send", "Discard"], BUTTONS)
      }
   },
   Send: {
      selectors: ["div.aoO"],
      handler: async function onClick() {
         addOnClickHandlerTo(["Reply", "Forward"], BUTTONS)
      }
   },
   Discard: {
      selectors: ["div.og"],
      handler: async function onClick() {
         addOnClickHandlerTo(["Reply", "Forward"], BUTTONS)
      }
   }
}

async function removeQuotes() {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   if (!isExtEnabled) return;
   
   const trimBtn = await waitForElement(TRIM_BTN, TIMEOUT_SEC, { targetNode: getLastElement("div.gA.gt") })
   if (trimBtn) {
      await sleep(1)
      await click(trimBtn)
   }
   const quotes = await waitForElement(QUOTES, TIMEOUT_SEC, { targetNode: getLastElement("div.gA.gt"), last: false})
   if (!quotes) return;
   quotes.parentNode.removeChild(quotes);
}

// Its important to kickoff all the promises at the same time 
// instead of await them, for not letting the timeout_wait on 
// absent elements like Reply All to block the registering the 
// handler on elements which are present.
function addOnClickHandlerTo(btnTypes, BUTTONS) {
   btnTypes = Array.isArray(btnTypes) ? btnTypes : [btnTypes]
   for (const btnType of btnTypes) {
      for (const selector of BUTTONS[btnType].selectors) {
         waitForElement(selector, TIMEOUT_SEC).then((element) => {
            if (!element) return;
            element.addEventListener("click", BUTTONS[btnType].handler)
         })
      }
   }
}

async function main() {
   await sleep(1)
   const isEmailPage = await waitForElement("div.nH[role=list]", 0.5)
   if (!isEmailPage) return;
   addOnClickHandlerTo(["Reply", "Forward"], BUTTONS)
}

window.addEventListener("hashchange", main)

main()