const { Observable, fromEvent, race, EMPTY, of, iif } = require("rxjs")
const { delay, map, flatMap, take, catchError, switchMap, defaultIfEmpty } = require("rxjs/operators")
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
   not: require("ramda/src/not"),
   isNil: require("ramda/src/isNil"),
   isEmpty: require("ramda/src/isEmpty"),
   last: require("ramda/src/last"),
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
   const trimNodes = Array.from(document.querySelectorAll("div.ajR"))
   const lastTrimNode = R.last(trimNodes)
   const removeNode = pipe(
      map(trimIcon => trimIcon.click()),
      delay(250),
      map(() => {
         const q = document.querySelector("div.ZyRVue .gmail_quote")
         q.parentNode.removeChild(q)
      }),
      tap(() => info("Quotes removed"))
   )
   return of(lastTrimNode).pipe(removeNode)
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

const toClickStream = pipe(
   (btn) => fromEvent(btn, "click"),
   take(1)
)

const getBtns = pipe(
   R.map((s) => document.querySelector(s)),
   R.filter(pipe(R.isNil, R.not))
)

const addHandlerToReplyBtns = () => {
   const replyBtns = getBtns(["span.ams.bkH", "span.ams.bkI"])

   if (R.isEmpty(replyBtns)) {
      log("Reply btns not found")
      return EMPTY
   }

   const replyBtns$ = R.map(toClickStream, replyBtns)

   const onReplyBtnClick = pipe(
      tap(() => info("Reply btn clicked")),
      delay(1000),
      flatMap(removeQuotes),
      flatMap(addHandlersToSendDiscardBtns)
   )
   
   info("Added handlers to Reply Buttons")
   return race(...replyBtns$).pipe(onReplyBtnClick)
}

const addHandlersToSendDiscardBtns = () => {
   const discardBtns = getBtns(["div.aoO", "div.og"])

   if (R.isEmpty(discardBtns)) {
      info("Send/Discard btns not founds")
      return EMPTY
   }

   const discardBtns$ = R.map(toClickStream, discardBtns)

   const onDiscardBtnClick = pipe(
      tap(() => info("Discard/Send button clicked")),
      delay(500),
      flatMap(addHandlerToReplyBtns)
   )

   info("Added handlers to Discard Buttons")
   return race(...discardBtns$).pipe(onDiscardBtnClick)
}

const main = pipe(
   fromEvent(window, "hashchange"),
   tap(() => info("hash changed")),
   delay(1000),
   switchMap(addHandlerToReplyBtns),
   catchErrorOf("UnQuote for Gmail")
)

main.subscribe(null, log)