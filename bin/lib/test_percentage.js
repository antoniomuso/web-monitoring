const request = require('request-promise-native')
const sanitizeHtml = require('sanitize-html')
const leven = require('node_leven_distance')
var sanOpt= {
  allowedAttributes: {
  }
}


module.exports = async function (nTest, uri) {
  if (nTest <= 0) throw new Error('nTest must be >0')
  var opt = {
    uri: uri,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }
  let page
  await request(opt).then((pageBody) => {
    page = sanitizeHtml(pageBody,sanOpt)
    // console.log(page.length)
  }).catch((err) => {
    throw err
  })

  let percentage = 0

  for (let i = 0; i < nTest; i++) {
    await request(opt).then((pageBody) => {
      let clear = sanitizeHtml(pageBody,sanOpt)
      percentage = Math.max(percentage, (leven(page, clear) / page.length))
      page = clear
      console.log(`percentage: ${percentage} nTest: ${i}`)
    }).catch((err) => {
      throw err
    })
  }
    // console.log(`Max percentage: ${percentage}`)

  return percentage
}
