const WebPage = require('./web_page.js')
/**
 * @param {String} url - Uri of web page
 * @param {Object} [options] - options on doc
 */
function monitor (url, options) {
  if ((typeof options === 'object' ||
        typeof options === 'function') && (typeof url === 'string')) {
    return new WebPage(url, options)
  }
  // var wp = new WebPage(url, options)
  throw new TypeError('wrong arguments of monitor function')
}

module.exports.monitor = monitor
