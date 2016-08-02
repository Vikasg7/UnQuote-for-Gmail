chrome.runtime.onMessage.addListener(function (request, response, sendBack) {
   if (request.action === "Enabled?") {
      var extEnabled = localStorage.extEnabled ? JSON.parse(localStorage.extEnabled) : false
      sendBack(extEnabled)
   }
})