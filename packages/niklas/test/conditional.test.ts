import { Niklas } from "..";

test("if true", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    var x = 17
    if (true) {
      x = 42
    }
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("x").value).toEqual(42);
});

test("if false", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    var x = 17
    if (false) {
      x = 42
    }
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("x").value).toEqual(17);
});

test("if true else", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    var x = 17
    if (true) {
      x = 42
    } else {
      x = 420
    }
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("x").value).toEqual(42);
});

test("if false else", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    var x = 17
    if (false) {
      x = 42
    } else {
      x = 420
    }
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("x").value).toEqual(420);
});

test("if true else if", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    var x = 17
    if (true) {
      x = 42
    } else if (false) {
      x = 69
    } else {
      x = 420
    }
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("x").value).toEqual(42);
});

test("if false else if", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  const code = `
    var x = 17
    if (false) {
      x = 42
    } else if (true) {
      x = 69
    } else {
      x = 420
    }
  `;

  await expect(niklas.run(code)).resolves.toEqual(0);
  expect(niklas.getVariable("x").value).toEqual(69);
});
