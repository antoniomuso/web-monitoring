# web-monitoring
Simple web monitoring in node js 

## How to install
`npm install web-monitoring -g`
## Use application
`web-monitoring [uri] [lapse of control] [percentage of page changing]
`
`web-monitoring http://google.it 5000 0.1`

## Use example 1°
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
## Use Example 2°
Allert will be called when oldPage is different from newPage of 0.1 
```javascript
var wm = require('web-monitoring')
var options = 
{ 
  lapse: 5000,
  percentageDiff: 0.1
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

