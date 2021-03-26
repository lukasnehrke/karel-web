import { Niklas } from '..'

test('assert', async () => {
  const niklas = new Niklas()
  niklas.registerDefaults()

  await expect(niklas.run('assert true')).resolves.toEqual(null)
  await expect(niklas.run('assert false')).rejects.toEqual({
    error: "Assertion failed: false"
  })
})

test('comments', async () => {
  const niklas = new Niklas()
  niklas.registerDefaults()

  await expect(niklas.run('// Hello World!')).resolves.toEqual(null)
  await expect(niklas.run('/* Hello World! */')).resolves.toEqual(null)
})
