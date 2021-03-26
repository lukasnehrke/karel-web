import { Niklas } from "..";

test("basic", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await niklas.run("assert true");
  await niklas.run("assert true == true");
  await niklas.run("assert 42 == 42");
  await niklas.run("assert (true == true)");
  await niklas.run("assert (42 == 42)");
});

test("multiple", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await niklas.run("assert (5 == 5 && 42 == 42)");
  await niklas.run("assert (1 == 2 || 42 == 42)");
  await niklas.run("assert (1 == 1 && 2 == 2 && 42 == 42)");
  await niklas.run("assert (1 == 2 || 2 == 3 || 42 == 42)");
});

test("single & multiple", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await niklas.run("assert (true && 5 == 5)");
  await niklas.run("assert (true && (5 == 5)");
  await niklas.run("assert (true || (2 == 3)");
});

test("complex", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await niklas.run("assert (123 == 123 && (2 == 3 || 5 == 5)");
  await niklas.run("assert (123 == 123 || (2 == 3 || 5 == 6)");
});

test("complex 2", async () => {
  const niklas = new Niklas();
  niklas.registerDefaults();

  await niklas.run("assert (123 == 123 && 3 == 3) && (2 == 3 || 5 == 5)");
  await niklas.run("assert (123 == 123 || 3 == 9) || (2 == 3 || 5 == 6)");
});
