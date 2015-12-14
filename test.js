'use strict'

var assert = require('assert')

assert.doesNotThrow(function () {
  require('./')
  setTimeout(function () {
    process.exit()
  }, 100)
})
