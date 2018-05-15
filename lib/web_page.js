const EventEmitter = require('events')
const request = require('request-promise-native')
const leven = require('leven')
const sanitizeHtml = require('sanitize-html')
var sanOpt= {
  allowedAttributes: {
  }
}

const lapseDefault = 10000

function activeInterval (opt, webPage, page, control, lapse) {
  return setTimeout(() => {
    request(opt)
            .then((body) => {
              process.nextTick(() => webPage.emit('check', page, body))
              if (!control(page, body)) process.nextTick(() => webPage.emit('alert', opt.uri, body))
              webPage.page = body
              webPage.numberInterval = activeInterval(opt, webPage, page, control, lapse)
            })
            .catch((err) => webPage.emit('error', err))
  }, lapse)
}

class WebPage extends EventEmitter {
  /**
   * @param {String} uri
   * @param {Object} [options]
   **/
  constructor (uri, options) {
    super()
    this.opt = {
      uri: uri,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }
    this.control = (options && options.whileControl && typeof options.whileControl === 'function')
            ? options.whileControl
            : (oldPage, newPage) => (leven(oldPage, sanitizeHtml(newPage,sanOpt)) / oldPage.length) <= options.percentageDiff
    this.lapse = (options && options.lapse && typeof options.lapse === 'number')
            ? options.lapse
            : lapseDefault
    this.numberInterval = undefined
    if (typeof options === 'function') this.control = options
    this.page = undefined
  }

  start () {
    request(this.opt)
            .then((body) => {
              if (this.numberInterval) return console.warn('Warning: You called the start function twice')
              process.nextTick(() => this.emit('start', this.opt.uri))
              this.page = sanitizeHtml(body,sanOpt)
              this.numberInterval = activeInterval(this.opt, this, this.page,
                    this.control, this.lapse)
            })
            .catch((error) => this.emit('error', error))
    return this
  }

  stop () {
    if (!this.numberInterval) return
    clearTimeout(this.numberInterval)
    this.numberInterval = undefined
    return this
  }
}

module.exports = WebPage
