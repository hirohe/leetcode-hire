import { serializeErrorStack } from '../src/foundations_zh'

test('chrome stack test', () => {
  const fixtureStack = `TypeError: Error raised
  at bar http://192.168.31.8:8000/c.js:2:9
  at foo http://192.168.31.8:8000/b.js:4:15
  at calc http://192.168.31.8:8000/a.js:4:3
  at <anonymous>:1:11
  at http://192.168.31.8:8000/a.js:22:3
`

  const result = serializeErrorStack(fixtureStack)
  console.log('chrome error', result)
  expect(result).not.toBe(null)
  expect(result!.message).toBe('Error raised')
  expect(result!.stack.length).toBe(4)
  expect(result!.stack[0]).toStrictEqual({
    line: 2,
    column: 9,
    filename: 'http://192.168.31.8:8000/c.js',
  })
})

test('firefox stack test', () => {
  const fixtureFirefoxStack = `
  bar@http://192.168.31.8:8000/c.js:2:9
  foo@http://192.168.31.8:8000/b.js:4:15
  calc@http://192.168.31.8:8000/a.js:4:3
  <anonymous>:1:11
  http://192.168.31.8:8000/a.js:22:3
`

  const result = serializeErrorStack(fixtureFirefoxStack)
  console.log('firefox error', result)
  expect(result).not.toBe(null)
  expect(result!.message).toBe('')
  expect(result!.stack.length).toBe(4)
  expect(result!.stack[0]).toStrictEqual({
    line: 2,
    column: 9,
    filename: 'http://192.168.31.8:8000/c.js',
  })
})

test('falsy test', () => {
  const empty = ''
  const result = serializeErrorStack(empty)
  expect(result).toBe(null)
})

// test('actual Error stack test', () => {
//   function fn_cause_error() {
//     throw new Error('error from fn_cause_error')
//   }
//
//   function main_test() {
//     fn_cause_error()
//   }
//
//   try {
//     main_test()
//   } catch (e) {
//     console.log(e.stack)
//   }
// })
