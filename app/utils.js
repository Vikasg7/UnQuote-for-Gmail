const { Observable, of } = require("rxjs")
const { map, flatMap } = require("rxjs/operators")

const curry = fn => (...args) =>
   (args.length < fn.length)
      ? (...rest) => curry(fn)(...[...args, ...rest])
      : fn(...args)

const pipe = (input, ...fns) => {
   const isFunction = (fn) => typeof fn === 'function'
   const pipeIn = (...fns) => (input) => fns.reduce((prev, fn) => fn(prev), input)
   return isFunction(input)
      ? pipeIn(input, ...fns)
      : pipeIn(...fns)(input)
}

const tap = (fn) => {
   const tapper = (x, i) => {
      const v = fn(x, i)
      return (v instanceof Observable)
         ? v.pipe(map(() => x))
         : of(x)
   }
   return flatMap(tapper)
}

module.exports = {
   curry,
   pipe,
   tap
}