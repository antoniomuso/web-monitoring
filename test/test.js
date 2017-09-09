var wm = require('./../index.js')
var options =
  {
    whileControl: (oldPage, newPage) => {
      return oldPage !== newPage
    },
    lapse: 2000,
    percentageDiff: 0.1 // if whileControl exist this will not use
  }
var wp = wm.monitor('https://www.google.com/', options).start().start()
wp.on('start', (url) => console.log(`monitoring of '${url}' start`))
wp.on('alert', (url, page) => {
  console.log('page changed')
  wp.stop()
})
wp.on('check', (oldPage, newPage) => {
  console.log('check')
})
wp.on('error', (err) => console.log(err))
