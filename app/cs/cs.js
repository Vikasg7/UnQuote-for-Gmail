const { Observable, fromEvent, race, EMPTY, of, iif } = require("rxjs")
const { delay, map, flatMap, take, catchError, defaultIfEmpty } = require("rxjs/operators")
const { pipe, tap } = require("../utils")
const { log, info } = console
const R = {
   ap: require("ramda/src/ap"),
   filter: require("ramda/src/filter"),
   propEq: require("ramda/src/propEq"),
   head: require("ramda/src/head"),
   ifElse: require("ramda/src/ifElse"),
   equals: require("ramda/src/equals"),
   map: require("ramda/src/map"),
   tap: require("ramda/src/tap"),
   of: require("ramda/src/of"),
   Not: require("ramda/src/Not"),
   isNil: require("ramda/src/isNil"),
   isEmpty: require("ramda/src/isEmpty")
}

const isExtEnabled = () => Observable.create((Observer) => {
   chrome.extension.sendMessage({ action: "isExtEnabled" }, (msg) => {
      Observer.next(msg)
      Observer.complete()
   })
})

const getNodeByText = (text) => pipe(
   R.filter(R.propEq("innerText", text)),
   R.head
)

const _removeQuotes = (isExtEnabled) => {
   if (!isExtEnabled) {
      info("Extension is not Enabled")
      return of("") // pipe(EMPTY, defaultIfEmpty(""))
   }
   return pipe(
      of(document.querySelector("div.bTfW2d").parentNode),
      map(trimIcon => trimIcon.click()),
      delay(250),
      map(() => {
         const q = document.querySelector("div.ZyRVue .gmail_quote")
         q.parentNode.removeChild(q)
      }),
      tap(() => info("Quotes removed"))
   )
}

const removeQuotes = pipe(
   isExtEnabled,
   flatMap(_removeQuotes)
)

const catchErrorOf = (funcName) => 
   catchError(pipe(
      R.tap(x => log(funcName, x)),
      () => EMPTY
   ))

const _addHandlerToReplyBtns = () => {
   const replyBtns = pipe(
      document.querySelectorAll("span.ams"),
      Array.from, // converts NodeList to Array
      R.of,
      R.ap([
         getNodeByText("Reply"),
         getNodeByText("Reply all")
      ]),
      R.filter(pipe(R.isNil, R.Not)),
   )
   
   const addHandler = pipe(
      (btn) => fromEvent(btn, "click"),
      take(1),
      delay(3000),
      flatMap(removeQuotes)
   )

   const replyBtns$ = R.map(addHandler, replyBtns)
   info("Added handlers to Reply Buttons")
   return iif(
      () => R.isEmpty(replyBtns),
      EMPTY,
      pipe(race(...replyBtns$), tap(() => info("Reply btn clicked")))
   )
}

const addHandlersToSendDiscardBtns = () => {
   const btns$ = R.map(
      pipe(
         (btn) => fromEvent(btn, "click"),
         take(1)
      ),
      [document.querySelector("div.aoO"),
       document.querySelector("div.og")]
   )
   info("Added handlers to Discard Buttons")
   return pipe(
      race(...btns$),
      tap(() => info("Discard/Send button clicked")),
      addHandlerToReplyBtns
   )
}

const addHandlerToReplyBtns = pipe(
   delay(2000),
   flatMap(_addHandlerToReplyBtns),
   flatMap(addHandlersToSendDiscardBtns)
)

const main = pipe(
   fromEvent(window, "hashchange"),
   tap(() => info("hash changed")),
   addHandlerToReplyBtns,
   catchErrorOf("UnQuote for Gmail")
)

main.subscribe(null, log)