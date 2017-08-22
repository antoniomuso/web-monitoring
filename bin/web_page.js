const EventEmitter = require('events')
const request = require('request')

const lapseDefault = 10000
const whileControlDefault = (oldPage,newPage) => oldPage === newPage

class WebPage extends EventEmitter {
    constructor(webPage, options) {
        super()
        this.active = false
        this.control = (options.whileControl && typeof options.whileControl === 'function' )
            ? options.whileControl 
            : whileControlDefault
        this.lapse = (options.lapse && typeof options.lapse === 'number') 
            ? options.lapse
            : lapseDefault
        
        








    }

    start () {
        
    }

    close () {

    }

    stop () {

    }


}
module.exports = WebPage