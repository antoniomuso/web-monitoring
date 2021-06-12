const EventEmitter = require('events')
const got = require('got')
const leven = require('leven')
const sanitizeHtml = require('sanitize-html')

const lapseDefault = 10000

function activeInterval(webPage) {
  const { url, opt, page, control, lapse } = webPage
  return setInterval(async () => {
    try {
      const { body } = await got(url, opt)
      setImmediate(() => webPage.emit('check', page, body))
      if (!control(page, body)) {
        setImmediate(() => webPage.emit('alert', url, body))
      }
      webPage.page = body
    } catch (err) {
      webPage.emit('error', err)
    }
  }, lapse)
}

class WebPage extends EventEmitter {
  /**
   * @param {String} uri
   * @param {Object} [options]
   **/
  constructor(url, options) {
    super()
    this.sanOpt = options?.sanitizeOpt || { allowedAttributes: {} }
    this.url = url
    this.opt = {
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }
    this.control =
      typeof options?.whileControl === 'function'
        ? options.whileControl
        : (oldPage, newPage) =>
            leven(oldPage, sanitizeHtml(newPage, this.sanOpt)) /
              oldPage.length <=
            options.percentageDiff

    this.lapse =
      typeof options?.lapse === 'number' ? options.lapse : lapseDefault

    this.timeout = undefined
    if (typeof options === 'function') this.control = options
    this.page = undefined
  }

  start() {
    if (this.called) {
      console.warn('Warning: You called the start function twice')
      return this
    }
    this.called = true
    ;(async () => {
      try {
        const { body } = await got(this.url, this.opt)
        setImmediate(() => this.emit('start', this.url))
        this.page = sanitizeHtml(body, this.sanOpt)
        this.timeout = activeInterval(this)
      } catch (error) {
        this.emit('error', error)
      }
    })().catch((error) => this.emit('error', error))
    return this
  }

  stop() {
    if (!this.timeout) return
    clearTimeout(this.timeout)
    this.timeout = undefined
    return this
  }
}

module.exports = WebPage
