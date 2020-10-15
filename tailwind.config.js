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
      'screen': '100vh',
    },
    extend: {
      boxShadow: {
        right: '1px 0 rgba(0, 0, 0, 0.1)',
      },
      flex: {
        '1-33': '1 1 33.3%',
        '1-50': '1 1 50%',
      },
      fontSize: {
        'xxs': '.5rem',
      },
      height: {
        '14': '3.5rem',
      },
      inset: {
        '-32': '-8rem',
        '-8': '-2rem',
        '-2': '-0.5rem',
        '2': '0.5rem',
        '8': '2rem',
        '14': '3.5rem',
      },
      minHeight: {
        '8': '2rem',
      },
      minWidth: {
        '1/2': '50%',
        '12': '12rem',
        '16': '16rem',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
      },
      zIndex: {
        '1': 1,
        '2': 2,
        '10': 10,
        '100': 100,
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
