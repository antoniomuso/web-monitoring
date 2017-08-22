# web-monitoring
Simple web monitoring in node js 

## Use example
```javascript
var wm = require('web-monitoring')
var options = 
{ 
  whileControl: (oldPage,newPage) => {return oldPage === newPage},
  lapse: 5000
}
var wp = wm.monitor('http://www.gogle.com', options).start()
wp.on('start', (url) => console.log(`monitoring of '${url}' start`))
wp.on('alert', (url,page) => {
  console.log('page changed')
  wp.stop()
})
wp.on('check', (oldPage, newPage) => {
})
wp.on('error', (err) => console.log(error))
``` 

