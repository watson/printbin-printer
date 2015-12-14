'use stirct'

var opbeat = require('opbeat').start()
var uuid = require('node-uuid')
var AWS = require('aws-sdk')
var Printer = require('ipp-printer')

var port = process.env.PORT || 3000

var s3 = new AWS.S3()
var printer = new Printer({ name: 'printbin', port: port, zeroconf: false })

printer.on('job', function (job) {
  var key = uuid.v4() + '.ps'

  console.log('processing job %d (key: %s)', job.id, key)

  job.on('end', function () {
    console.log('done reading job %d (key: %s)', job.id, key)
  })

  var params = {
    Bucket: 'watson-printbin',
    ACL: 'public-read',
    ContentType: 'application/postscript',
    StorageClass: 'REDUCED_REDUNDANCY',
    Metadata: { name: job.name },
    Key: key,
    Body: job
  }

  s3.upload(params, function (err, data) {
    if (err) return opbeat.captureError(err)
    console.log('done uploading job %d (key: %s)', job.id, key)
  })
})
