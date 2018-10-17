chrome.runtime.onMessage.addListener(function (message, sender, sendBack) {
   if (message.action === "isExtEnabled") {
      const isExtEnabled = localStorage.isExtEnabled ? JSON.parse(localStorage.isExtEnabled) : false
      sendBack(isExtEnabled)
   }
})