process.env.NODE_ENV = process.env.NODE_ENV || 'production'

require('intersection-observer')
const environment = require('./environment')

module.exports = environment.toWebpackConfig()
