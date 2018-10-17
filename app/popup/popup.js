(function (document, localStorage) {

   var isExtEnabled = localStorage.isExtEnabled ? JSON.parse(localStorage.isExtEnabled) : false

   // Manipulating button text
   var btn = document.getElementsByClassName("btn")[0]
   if (isExtEnabled) {
      btn.innerText = "Click here to Disable"
   } else {
      btn.innerText = "Click here to Enable"
   }

   // Adding onClick Handler for Toggling Enable or disable
   btn.onclick = function () {
      if (isExtEnabled) {
         isExtEnabled = false
         localStorage.isExtEnabled = isExtEnabled
         btn.innerText = "Click here to Enable"
      } else {
         isExtEnabled = true
         localStorage.isExtEnabled = isExtEnabled
         btn.innerText = "Click here to Disable"
      }
   }

})(document, localStorage)