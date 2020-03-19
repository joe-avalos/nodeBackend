const cors = require('cors')

const whitelist = ['http://localhost:3000', 'https://localhost:3443']

const corsOptionsDelegate = (req, callback) => {
  let corsOpts
  
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOpts = {origin: true}
  } else {
    corsOpts = {origin: false}
  }
  callback(null, corsOpts)
}

exports.cors = cors()
exports.corsWithOptions = cors(corsOptionsDelegate)
