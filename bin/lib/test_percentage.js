const request = require('request-promise')
const leven = require('node_leven_distance')

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
    page = pageBody
        // console.log(pageBody.length)
  }).catch((err) => {
    throw err
  })

  let percentage = 0

  for (let i = 0; i < nTest; i++) {
    await request(opt).then((pageBody) => {
      percentage = Math.max(percentage, (leven(page, pageBody) / page.length))
      page = pageBody
      console.log(`percentage: ${percentage} nTest: ${i}`)
    }).catch((err) => {
      throw err
    })
  }
    // console.log(`Max percentage: ${percentage}`)

  return percentage
}
