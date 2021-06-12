const { test } = require('tap')
const wm = require('./../index.js')
const nock = require('nock')
const sinon = require('sinon')

test('wm should work', ({ plan, ok, same, end, notOk }) => {
  const options = {
    lapse: 500,
    percentageDiff: 0.004 // if whileControl exist this will not use
  }
  plan(4)
  const call = sinon.spy()
  const counter = sinon.spy()
  const wp = wm.monitor('https://www.google.com/', options).start()
  wp.on('start', (url) => call())
  wp.on('alert', (url, page) => {
    ok(call.calledOnce)
    ok(wp.timeout)
    wp.stop()
    notOk(wp.timeout)
    same(counter.callCount, 4)
    end()
  })
  wp.on('check', (oldPage, newPage) => {
    counter()
  })
  wp.on('error', (err) => console.log(err))

  setTimeout(() => {
    nock('https://www.google.com').get('/').reply(200, '<html></html>')
  }, 2000)
})

/*
test('wm should with while control', ({ plan, ok, same, end, notOk }) => {
  const whileControl = sinon.spy((oldP, newP) => oldP === newP)
  const options = {
    lapse: 500,
    whileControl,
    percentageDiff: 0.004 // if whileControl exist this will not use
  }
  plan(4)
  const call = sinon.spy()
  const wp = wm.monitor('https://www.google.com/', options).start()
  wp.on('start', (url) => call())
  wp.on('alert', (url, page) => {
    ok(call.calledOnce)
    ok(wp.timeout)
    wp.stop()
    notOk(wp.timeout)
    same(whileControl.callCount, 4)
    end()
  })
  wp.on('check', (oldPage, newPage) => {
  })
  wp.on('error', (err) => console.log(err))

  setTimeout(() => {
    nock('https://www.google.com').get('/').reply(200, '<html></html>')
  }, 2000)
})
*/
