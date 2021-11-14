const { test, beforeEach } = require('tap')
const wm = require('./../index.js')
const nock = require('nock')
const sinon = require('sinon')

beforeEach(() => nock.cleanAll())

test('can be called twice', (t) => {
  let called = false
  const mon = wm
    .monitor('http://antoniomusolino.com/', { lapse: 100 })
    .start()
    .start()
  mon.on('check', () => {
    mon.stop()
    called || t.end()
    called = true
  })
})

test('should throw type error', (t) => {
  t.throws(
    () => wm.monitor('http://antoniomusolino.com/', 400),
    TypeError,
    'wrong arguments of monitor function'
  )
  t.end()
})

test('should call err at startup', ({ plan, ok, same, end, notOk }) => {
  const options = {
    lapse: 500,
    percentageDiff: 0.004 // if whileControl exist this will not use
  }
  nock('https://www.facebook.com').get('/').reply(404, '<html></html>')

  const wp = wm.monitor('https://www.facebook.com/', options).start()
  wp.on('alert', (url, page) => {})
  wp.on('error', (err) => {
    same(err.name, 'HTTPError')
    end()
    wp.stop()
  })
})

test('should call err', ({ plan, ok, same, end, notOk }) => {
  const options = {
    lapse: 500,
    percentageDiff: 0.004 // if whileControl exist this will not use
  }
  const wp = wm.monitor('https://www.facebook.com/', options).start()
  wp.on('alert', (url, page) => {})
  wp.on('error', (err) => {
    same(err.name, 'HTTPError')
    end()
    wp.stop()
  })

  setTimeout(() => {
    nock('https://www.facebook.com').get('/').reply(404, '<html></html>')
  }, 2100)
})

test('passing while control', (t) => {
  const mon = wm
    .monitor('http://antoniomusolino.com/', (old, newP) => old !== newP)
    .start()
  mon.on('alert', () => {
    mon.stop()
    t.end()
  })
})

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
    ok(counter.callCount >= 4)
    end()
  })
  wp.on('check', (oldPage, newPage) => {
    counter()
  })
  wp.on('error', (err) => console.log(err))

  setTimeout(() => {
    nock('https://www.google.com').get('/').reply(200, '<html></html>')
  }, 2100)
})

test('wm should with while control', ({ plan, ok, same, end, notOk }) => {
  const whileControl = sinon.spy((oldP, newP) => {
    return oldP === newP
  })
  const options = {
    lapse: 500,
    whileControl,
    percentageDiff: 0.003 // if whileControl exist this will not use
  }
  const counter = sinon.spy()

  const call = sinon.spy()
  const wp = wm.monitor('http://antoniomusolino.com/', options).start()
  wp.on('start', (url) => call())
  wp.on('alert', (url, page) => {
    ok(call.calledOnce)
    ok(wp.timeout)
    wp.stop()
    notOk(wp.timeout)
    ok(counter.callCount >= 4)
    ok(whileControl.callCount >= 4)
    end()
  })
  wp.on('check', (oldPage, newPage) => {
    counter()
  })
  wp.on('error', (err) => console.log(err))

  setTimeout(() => {
    nock('http://antoniomusolino.com').get('/').reply(200, '<html></html>')
  }, 2100)
})
