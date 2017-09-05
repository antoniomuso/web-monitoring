#!/usr/bin/env node


// web-monitoring 'http://google.it' 2000
const wm = require('./../index.js')
const commandLineArgs = require('command-line-args')
const nodemailer = require('nodemailer');
const bp = require('./lib/test_percentage.js')

const optionDefinitionsArgs = [
    { name: 'uri', alias: 'u', type: String },
    { name: 'email', alias: 'e', multiple: true, type: String },
    { name: 'lapse', alias: 'l', type: Number ,defaultValue: 5000},
    { name: 'percentage', alias: 'p', type: Number },
    { name: 'loop', alias: 'o', type: Boolean , defaultValue: false },
    { name: 'NumberOfTest', alias: 't', type: Number , defaultValue: 10 }
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
    })
    var mailOptions = {
        from: values.email[0],
        to: values.email[2],
        subject: `Notification Changing page ${values.uri}`,
        text: `${values.uri} was change`
    }
}
if (!values.uri) throw new URIError('Uri is obligatory')
;(async function () {
    var options = {
        lapse: values.lapse ,
        percentageDiff: values.percentage 
            ? values.percentage 
            : await bp(values.NumberOfTest, values.uri) // if whileControl exist this will not use
    }

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
            console.log(values.loop)
            if (!values.loop) wp.stop()
        })
        .on('error', (error) => {
            throw error
        })


})().catch((err) => {
    throw new Error(err)
})