var wm = require('./index.js')

var options = 
{ 
  whileControl: (oldPage,newPage) => { return oldPage !== newPage},
  lapse: 5000
}
var wp = wm.monitor('http://twiki.di.uniroma1.it/twiki/view', options).start().start()
wp.on('start', (url) => console.log(`monitoring of '${url}' start`))
wp.on('alert', (url,page) => {
  console.log('page changed')
  wp.stop()
})
wp.on('check', (oldPage, newPage) => { console.log('check')
})
wp.on('error', (err) => console.log(err))