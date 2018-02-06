# web-monitoring [![NPM Version](https://img.shields.io/npm/v/web-monitoring.svg)](https://www.npmjs.com/package/web-monitoring) [![node](http://img.shields.io/badge/node->=8.4.0-brightgreen.svg)]() [![dependencies Status](https://david-dm.org/antoniomuso/web-monitoring/status.png)](https://david-dm.org/antoniomuso/web-monitoring) [![Build Status](https://travis-ci.org/antoniomuso/web-monitoring.svg?branch=master)](https://travis-ci.org/antoniomuso/web-monitoring)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard) 
> Web-monitoring is a small web page monitoring lib written in node.js, you can monitor changing of a web page. Compatible with **Node v8.4.0** and above.
## App
[web-monitoring-app](https://github.com/antoniomuso/web-monitoring-app)
## How to install
`npm install web-monitoring --save`

## How To Use

```js
var options =
{
  whileControl: Function,        // function called when lapse expired. if returns true, the event 'alert' will be call.
  lapse: Number,   // lapse time in ms.
  percentageDiff: Number,   // percentage difference  that is needed to call 'alert' event. This option does not need if whileControl function is set.                                        
}
```
Example:
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
Example:
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
Allert will be called when oldPage is different from newPage of 0.1.
## Authors

* **Antonio Musolino** - [antoniomuso](https://github.com/antoniomuso)



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


