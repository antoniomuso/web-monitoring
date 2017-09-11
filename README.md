# web-monitoring [![NPM Version](https://img.shields.io/npm/v/web-monitoring.svg)](https://www.npmjs.com/package/web-monitoring) [![dependencies Status](https://david-dm.org/antoniomuso/web-monitoring/status.png)](https://david-dm.org/antoniomuso/web-monitoring)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
> Web-monitoring is a small web page monitoring written in node.js, you can monitor changing of a web page. Compatible with **Node v8.4.0** and above.

## How to install
`npm install web-monitoring -g`
## Use application
```
web-monitoring -u [uri] -l [lapse of control] -p [percentage of page changing] -t [number of test for calculate automatic percentage of page changing] -e [email sender] [password sender] [email receiver]
web-monitoring -u http://google.com -l 5000 -p 0.1
or 
web-monitoring -u http://google.com -l 5000 -p 0.1 -e myname@host.com passwordmyname myname@host.com
or 
web-monitoring -u http://google.com -e myname@host.com passwordmyname myname@host.com
or
web-monitoring -u http://google.com -l 5000 -p 0.1 -e myname@host.com passwordmyname myname@host.com -loop
Without command -loop,  the program stop at first page change
```

## Use example 1°
```javascript
var wm = require('web-monitoring')
var options = 
{ 
  whileControl: (oldPage,newPage) => oldPage === newPage,
  lapse: 5000
}
var wp = wm.monitor('http://www.google.com', options)
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
var wp = wm.monitor('http://www.google.com', options)
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

