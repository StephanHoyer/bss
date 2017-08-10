require('reify')
const o = require('ospec')

const styleEl = {}
global.document = {
  createElement: () => styleEl,
  head: {
    appendChild: () => null
  },
  documentElement: {
    style: {
      width: 0
    }
  }
}

global.window = {
  navigator: {
    userAgent: 'test'
  }
}

const b = require('../lib').default
const sheet = require('../lib/sheet')

function nextTick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

o('inputs', function() {
  o(b`foo: bar;`.style).deepEquals({foo: 'bar'})
  o(b`foo bar`.style).deepEquals({foo: 'bar'})
  o(b({foo: 'bar'}).style).deepEquals({foo: 'bar'})
})

o('css class generation', async function(done) {
  const cls = b`foo: bar;`.class
  await nextTick()
  o(cls).equals(sheet.classPrefix + 1)
  o(styleEl.textContent).equals(`.${cls}{foo:bar;}`)
  done()
})

o.spec('helpers', function() {
  o('without args', function() {
    b.helper('foobar', b`foo bar`.style)
    o(b.foobar.style).deepEquals({foo: 'bar'})
  })

  o('with args (object notation)', function() {
    b.helper('foo', arg => ({foo: arg}))
    o(b.foo('bar').style).deepEquals({foo: 'bar'})
  })

  // todo make this work
  o('with args (bss notation)', function() {
    return
    b.helper('foo', arg => b`foo: ${arg}`.style)
    o(b.foo('bar').style).deepEquals({foo: 'bar'})
  })
})
