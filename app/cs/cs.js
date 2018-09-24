(function (window, document) {

   window.onload = function () {
      
      setTimeout(addListenerToReplyButton, 2000)
      
      var statusMessage = document.querySelector("div.vh")
      statusMessage.addEventListener("DOMSubtreeModified", function () {
         if (statusMessage.innerText === "Your message has been sent." ||
             statusMessage.innerText.search("Your message has been discarded.") > -1) {
            setTimeout(function () {
               chrome.runtime.sendMessage({action: "addListenerToReplyButton"})
            }, 20)
         }
      })
   }

   // Removing the previous listener, if any
   window.removeEventListener("hashchange", onHashChange)

   // Adding an event listener
   window.addEventListener("hashchange", onHashChange)

   function onHashChange() {
      chrome.runtime.sendMessage({action: "addListenerToReplyButton"})
   }

   chrome.runtime.onMessage.addListener(function (message) {
      // console.log(message.action)
      if (message.action === "_addListenerToReplyButton") {
         addListenerToReplyButton()
      } else if (message.action === "_removeQuotes") {
         removeQuotes(message.isExtEnabled)
      }
   })

   function addListenerToReplyButton() {
      // console.log("yes, I am triggered!")
      var spans = document.querySelectorAll("span.ams")
      if (!spans.length) {
         console.log("Reply Button not found.")
      } else {
         var replyButton
         spans.forEach(function (span, i) {
            if (span.innerText.toLowerCase() === "reply") {
               replyButton = span
            }
         })
         if (!replyButton.id) {
            // console.log("Reply Button is null.")
            return
         }
         replyButton.addEventListener("click", function () {
            chrome.runtime.sendMessage({action: "removeQuotes"})
         })
         // console.log("Listener added to Reply button.")
      }
   }

   function removeQuotes(extEnabled) {
      if (!extEnabled) {
         // console.log("Extension not enabled!")
      } else {
         // console.log("Extension is enabled!")
         var inputEle = document.querySelector("input[name='uet']")
         var quotedText = inputEle.getAttribute("value")
         var parser = new DOMParser()
         var doc = parser.parseFromString(quotedText, "text/html")
         var signature = doc.querySelector(".gmail_signature")
         var newValue = signature ? signature.innerHTML : ""
         inputEle.setAttribute("value", newValue)
         // console.log("Quotes Removed!")            
      }
   }

})(window, document)
