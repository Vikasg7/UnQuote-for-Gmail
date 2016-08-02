(function (window, document, localStorage) {

   // Removing the previous listener, if any
   window.removeEventListener("haschange", addListenerToReplyButton)

   // Adding an event listener
   window.addEventListener("hashchange", addListenerToReplyButton)

   // On page refresh
   document.onreadystatechange = function () {
      console.log(document.readyState)
      if (document.readyState === "complete") {
         setTimeout(addListenerToReplyButton, 2000)
      }
   }

   function addListenerToReplyButton() {
      setTimeout(function () {
         var replyButton = (function (document) {
            var spans = document.querySelectorAll("span.ams")
            if (!spans.length) {
               console.log("Reply Button not found.")
               return null
            } else {
               var replyButton
               spans.forEach(function (span, i) {
                  if (span.innerText === "Reply") {
                     replyButton = span
                  }
               })
               return replyButton
            }
         })(document)
         if (!replyButton) return
         replyButton.addEventListener("click", removeQuotedText)
         console.log("Listener added to Reply button.")
      }, 1000)
   }

   function removeQuotedText() {
      setTimeout(function () {
         chrome.runtime.sendMessage({action: "Enabled?"}, function (extEnabled) {
            if (!extEnabled) {
               console.log("Extension not enabled!")
            } else {
               console.log("Extension is enabled!")
               var inputEle = document.querySelectorAll("input[name='uet']")[0]
               var quotedText = inputEle.getAttribute("value")
               var parser = new DOMParser()
               var doc = parser.parseFromString(quotedText, "text/html")
               var signature = doc.querySelector(".gmail_signature")
               var newValue = signature ? signature.innerHTML : ""
               inputEle.setAttribute("value", newValue)
               console.log("Quotes Removed!")            
            }
         })
         // Adding a listener to send button to add listeners to Reply button again
         var sendButton = document.querySelectorAll("div[data-tooltip^='Send']")[0]
         sendButton.addEventListener("click", addListenerToReplyButton)
         console.log("Listener added to Send Button.")
         // Adding a listener to discard button to add listeners to Reply button again
         var discardButton = document.querySelectorAll("div.og")[0]
         discardButton.addEventListener("click", addListenerToReplyButton)
         console.log("Listener added to discard Button.")
      }, 1000)
   }

})(window, document, localStorage)