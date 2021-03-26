import { World } from "@/lib/world";
export { default as info } from "./README.md";

export const level = 3;

export const generateWorld = (level: number) => {
  const world = new World(10, 0, 9, 1);
  world.addWall(0, 0, 1);
  world.addWall(0, 0, 2);
  switch (level) {
    case 0:
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < i; j++) {
          world.addBox(i + 4, world.size - 1 - j);
        }
      }
      break;
    case 1:
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < i; j++) {
          world.addBox(i + 3, world.size - 1 - j);
        }
      }
      break;
    case 2:
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < i; j++) {
          world.addBox(i + 1, world.size - 1 - j);
        }
      }
      break;
  }
  return world;
};

export const solution = `
  while (frontIsClear()) {
    moveForward()
  }
  while (!wallAhead()) {
    turnLeft()
    moveForward()
    turnRight()
    moveForward()
  }
`;
