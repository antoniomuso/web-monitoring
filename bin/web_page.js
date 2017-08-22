const EventEmitter = require('events')
const util = require('util')
const request = util.promisify(require('request'))


const lapseDefault = 10000
const whileControlDefault = (oldPage, newPage) => oldPage === newPage


var call = function () { 

    function doRequest(url, webPage) {
        request(url,(error, response, body) => {
            if (error) return process.nextTick(() => webPage.emit('error', error))
            
        })
    }

    function activeInterval (wp, control, lapse) {
        setInterval( () => {

        }, lapse)
    }

    class WebPage extends EventEmitter {
        constructor(url, options) {
            super()
            this.active = false
            this.control = (options.whileControl && typeof options.whileControl === 'function')
                ? options.whileControl
                : whileControlDefault
            this.lapse = (options.lapse && typeof options.lapse === 'number')
                ? options.lapse
                : lapseDefault
            this.numberInterval = undefined
            if (typeof options === 'function') this.control = options
            this.page = undefined

        }

        start() {
            
            request(url).then( (error,responce,body) => {
                if (error) return process.nextTick(() => this.emit('error',error))
                this.page = body
                
            })

        }

        close() {

        }

        stop() {

        }


    }
    return WebPage
} ()
module.exports = WebPage