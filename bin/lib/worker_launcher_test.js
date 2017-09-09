const WorkerNode = require('worker-nodes')
const path = require('path')
module.exports = async function (nTest, uri) {
  console.log('Running the tests')
  var worker = new WorkerNode(path.join(__dirname, 'test_percentage.js'))
  let cores = require('os').cpus().length
  var jobs = []
    // Tests for Each job
  let testOnEach = Math.round(nTest / cores)
  let test = nTest
  for (let i = 0; i < cores; i++) {
    if (test <= testOnEach) {
      jobs.push(worker.call(test, uri))
      break
    }
    jobs.push(worker.call(testOnEach, uri))
    test -= testOnEach
  }
    // wait unti all jobs finish
  await Promise.all(jobs)
  worker.terminate()
    // Take Max value result from job and return
  let value = 0
  for (let i = 0; i < jobs.length; i++) {
    value = Math.max(await jobs[i], value)
  }
  console.log(`Percentage Value: ${value}`)
  return value
}
