#!/usr/bin/env node


// web-monitoring 'http://google.it' 2000
const wm = require('./../index.js')
const commandLineArgs = require('command-line-args')
const nodemailer = require('nodemailer');
const bp = require('./lib/best_percentage.js')

const optionDefinitionsArgs = [
    { name: 'uri', alias: 'u', type: String },
    { name: 'email', alias: 'e', multiple: true, type: String },
    { name: 'lapse', alias: 'l', type: Number },
    { name: 'percentage', alias: 'p', type: Number },
    { name: 'loop', alias: 'o', type: Boolean },
    {name: 'NumberOfTest', alias: 't', type:Number }
]

var values = commandLineArgs(optionDefinitionsArgs)

if (values.email && values.email.length === 3) {
    var reg = /@.*(\.(com|it|org|net))$/
    if (!reg.test(values.email[0]) && !reg.test(values.email[2])) {
        throw new Error('Emails is not compatible')
    }
    let emailService = reg.exec(values.email[0])[0].slice(1)
    emailService = emailService.slice(0, emailService.lastIndexOf('.'))

    var transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
            user: values.email[0],
            pass: values.email[1]
        }
    });
    var mailOptions = {
        from: values.email[0],
        to: values.email[2],
        subject: `Notification Changing page ${values.uri}`,
        text: `${values.uri} was change`
    };
}
bp(values.NumberOfTest ? values.NumberOfTest : 15, values.uri).then((perc) => {
    var options = {
        lapse: values.lapse ? values.lapse : 5000,
        percentageDiff: values.percentage ? values.percentage : perc // if whileControl exist this will not use
    }
    if (!values.uri) throw new URIError('Uri is obligatory')

    wp = wm.monitor(values.uri, options)
        .start()
        .on('start', (uri) => console.log(`monitoring of '${uri}' start`))
        .on('alert', (uri, page) => {
            if (values.email && values.email.length === 3) {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            } else {
                console.log(`page ${uri} chaged`)
            }
            if (!values.loop) wp.stop()
        })
        .on('error', (error) => {
            throw error
        })


}).catch((err) => {
    throw new Error(err)
})