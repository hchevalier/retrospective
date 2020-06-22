const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [],
  theme: {
    maxHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    extend: {
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  variants: {
    margin: ['responsive', 'first', 'last'],
    height: ['important']
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      })
    })
  ],
}
