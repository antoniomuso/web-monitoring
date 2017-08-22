# web-monitoring
Simple web monitoring in node js 

## Use example
```javascript
var wm = require('web-monitoring')
var options = 
{ 
  while: (oldPage,newPage) => {return oldPage === newPage},
  lapse: 5000
}
var wp = wm.monitor('www.webpage.com', options)
wp.on('start', (url) => console.log(`monitoring of '${url}' start`))
wp.on('alert', (page) => {
  console.log('page changed')
  wp.close()
})
wp.on('check', (oldPage, newPage) => {
}
wp.on('error', (err) => 'console.log(error)')
``` 

