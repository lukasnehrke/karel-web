import { Niklas } from "..";

test("assert", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await expect(niklas.run("assert true")).resolves.toEqual(0);
  await expect(niklas.run("assert false")).rejects.toHaveProperty("message", "Assertion failed: false")
});

test("comments", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await expect(niklas.run("// Hello World!")).resolves.toEqual(0);
  await expect(niklas.run("/* Hello World! */")).resolves.toEqual(0);
});
