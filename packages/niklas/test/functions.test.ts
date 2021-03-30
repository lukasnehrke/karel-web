import { Niklas } from "..";

test("square", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    def square(n: number): number {
      return n * n
    }

    val result = square(12)
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("result").value).toEqual(144);
});

test("recursion", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    def fib(n: number): number {
      if (n == 0 || n == 1) {
        return 1
      }
      return fib(n - 1) + fib(n - 2)
    }

    val result = fib(8);
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("result").value).toEqual(34);
});
