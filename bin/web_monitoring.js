const WebPage = require('./web_page.js')

module.exports.monitor = function (url, options) {
    if (options instanceof Object || 
        (typeof options === 'function') ) {
        return new WebPage(webPage, options)
    } 
    var wp = new WebPage(url, options)
    process.nextTick(() => wp.emit('error', new TypeError('wrong arguments of monitor function')))
    wp.close()
    return wp
}
