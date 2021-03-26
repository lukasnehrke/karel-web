import { Niklas } from '..'

test('decleration', async () => {
  const niklas = new Niklas()
  niklas.registerDefaults()

  const code = `
    var x = 17;
    val z = 42;
  `

  await expect(niklas.run(code)).resolves.toEqual(null)
  expect(niklas.getVariable("x")).toEqual({ final: false, type: "any", value: 17 })
  expect(niklas.getVariable("z")).toEqual({ final: true, type: "any", value: 42 })
})
