/* eslint-disable */
const initialize = (creators) => {

// /Users/gvwilson/stjs/module-bundler/simple/main.js
creators.set('/Users/gvwilson/stjs/module-bundler/simple/main.js',
(module, require) => {const other = require('./other')

const main = () => {
  console.log(other('main'))
}

module.exports = main
})

// /Users/gvwilson/stjs/module-bundler/simple/other.js
creators.set('/Users/gvwilson/stjs/module-bundler/simple/other.js',
(module, require) => {const other = (caller) => {
  return `other called from ${caller}`
}

module.exports = other
})


}

