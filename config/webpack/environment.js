const { environment } = require('@rails/webpacker')

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

// Workaround to "Cannot assign to read only property 'exports'" error
// https://github.com/apostrophecms/sanitize-html/issues/420#issuecomment-824483498
const nodeModulesLoader = environment.loaders.get('nodeModules')
if (!Array.isArray(nodeModulesLoader.exclude)) {
  nodeModulesLoader.exclude = (nodeModulesLoader.exclude == null)
    ? []
    : [nodeModulesLoader.exclude]
}
nodeModulesLoader.exclude.push(/sanitize-html/)

module.exports = environment
