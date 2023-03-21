globalThis.chrome = globalThis.browser ? globalThis.browser : globalThis.chrome

const REPLY_BTNS  = ["div[data-tooltip='Reply']", "span.ams.bkH"]
const FORWARD_BTN = "span.ams.bkG"
const DISCARD_BTN = "div.og"
const SEND_BTN    = "div.aoO"
const TRIM_BTN    = "div.ajR"

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration * 1000))

const waitForElement = (selector, timeout, targetNode = document.body) => 
   new Promise((resolve) => {
      const element = document.querySelector(selector)
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
         const element = document.querySelector(selector)
         if (!element) return;
         clearTimeout(id)
         observer.disconnect()
         resolve(element)
      })
      
      const id = setTimeout(() => {
         observer.disconnect()
         resolve()
      }, timeout)

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

async function removeQuotes() {
   const { isExtEnabled } = await chrome.storage.sync.get(["isExtEnabled"])
   if (!isExtEnabled) return;
   
   const trimBtn = await waitForElement(TRIM_BTN, 5000)
   if (!trimBtn) return;
   await click(trimBtn)
   await sleep(0.5)

   const quotes = document.querySelector("div.ZyRVue .gmail_quote")
   quotes.parentNode.removeChild(quotes)
}

async function onReply() {
   await removeQuotes()
   await addOnClickHandlerTo([SEND_BTN, DISCARD_BTN], onSendDiscard)
}

async function onSendDiscard() {
   await addOnClickHandlerTo(REPLY_BTNS, onReply)
   await addOnClickHandlerTo(FORWARD_BTN, onForward)
}

async function onForward() {
   await addOnClickHandlerTo([SEND_BTN, DISCARD_BTN], onSendDiscard)
}

async function addOnClickHandlerTo(selectors, handler) {
   selectors = Array.isArray(selectors) ? selectors : [selectors]
   for (const selector of selectors) {
      const element = await waitForElement(selector, 5000)
      if (element) element.addEventListener("click", handler)
   }
}

async function onHashChange() {
   await addOnClickHandlerTo(REPLY_BTNS, onReply)
   await addOnClickHandlerTo(FORWARD_BTN, onForward)
}

window.addEventListener("hashchange", onHashChange)
