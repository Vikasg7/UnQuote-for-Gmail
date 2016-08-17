chrome.runtime.onMessage.addListener(function (message) {
   // console.log(message.action)
   if (message.action === "addListenerToReplyButton") {
      sendMessage({action: "_addListenerToReplyButton"})
   } else if (message.action === "removeQuotes") {
      var isExtEnabled = localStorage.extEnabled ? JSON.parse(localStorage.extEnabled) : false
      sendMessage({action: "_removeQuotes", isExtEnabled: isExtEnabled})
   }
})

function sendMessage(message) {
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message)
   })
}