const WebPage = require('./web_page.js')

module.exports.monitor = function (url, options) {
  if (options instanceof Object ||
        (typeof options === 'function')) {
    return new WebPage(url, options)
  }
  var wp = new WebPage(url, options)
  throw new TypeError('wrong arguments of monitor function')
}
