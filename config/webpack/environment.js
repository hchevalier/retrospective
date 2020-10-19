const { environment } = require('@rails/webpacker')

// const svgr = {
//   test: /\.svg$/,
//   use: ['babel-loader', '@svgr/webpack'],
// }
//environment.loaders.insert('svgr', svgr, { before: 'file' })


const babelLoader = environment.loaders.get('babel')

environment.loaders.insert('svg', {
  test: /\.inline\.svg$/,
  use: babelLoader.use.concat([
    {
      loader: 'react-svg-loader',
      options: {
        jsx: true
      }
    }
  ])
}, { before: 'file' })

const fileLoader = environment.loaders.get('file')
fileLoader.exclude = /\.inline\.(svg)$/i

module.exports = environment
