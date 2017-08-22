var EventEmitter = require('events')

class WebPage extends EventEmitter {
    constructor(webPage, options) {
        super()
        this.active = false
        this.control = (options.whileControl && typeof options.whileControl === 'function' )
        ? options.whileControl 
        : (oldPage,newPage) => oldPage === newPage







    }

    start () {
        
    }

    close () {

    }

    stop () {

    }


}
module.exports = WebPage