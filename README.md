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
var wp = wm.monitor('http://www.gogle.com', options)
      .start()
      .on('start', (url) => console.log(`monitoring of '${url}' start`))
      .on('alert', (url,page) => {
             console.log('page changed')
             wp.stop()
           })
      .on('check', (oldPage, newPage) => {
           })
      .on('error', (err) => console.log(error))
``` 

