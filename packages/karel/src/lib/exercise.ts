export class Exercise {
  public readonly title: string;
  public readonly difficulty: number;
  public readonly slug: string;

  constructor(title: string, difficulty: number) {
    this.title = title;
    this.difficulty = difficulty;
    this.slug = title;
  }
}

export const exercises: Exercise[] = [];

exercises.push(new Exercise("karelsFirstProgram", 0));

exercises.push(new Exercise("obtainArtefact", 1));
exercises.push(new Exercise("defuseOneBomb", 1));
exercises.push(new Exercise("defuseTwoBombs", 1));
exercises.push(new Exercise("practiceHomeRun", 1));
exercises.push(new Exercise("climbTheStairs", 1));
exercises.push(new Exercise("fillTheHoles", 1));
exercises.push(new Exercise("saveTheFlower", 1));
exercises.push(new Exercise("mowTheLawn", 1));
exercises.push(new Exercise("harvestTheField", 1));
exercises.push(new Exercise("repairTheStreet", 1));
exercises.push(new Exercise("cleanTheRoom", 1));
exercises.push(new Exercise("tileTheFloor", 1));
exercises.push(new Exercise("stealOlympicFire", 1));
exercises.push(new Exercise("walkTheLabyrinth", 1));

exercises.push(new Exercise("hangTheLampions", 2));
exercises.push(new Exercise("cleanTheTunnels", 2));
exercises.push(new Exercise("increment", 2));
exercises.push(new Exercise("decrement", 1));
exercises.push(new Exercise("addSlow", 2));
exercises.push(new Exercise("saveTheFlowers", 2));
exercises.push(new Exercise("findTeddyBear", 2));
exercises.push(new Exercise("jumpTheHurdles", 2));
exercises.push(new Exercise("walkTheLabyrinth", 2));
exercises.push(new Exercise("solveTheMaze", 2));
exercises.push(new Exercise("quantize", 2));
exercises.push(new Exercise("addFast", 2));

exercises.push(new Exercise("partyAgain", 3));
exercises.push(new Exercise("fetchTheStars", 3));
exercises.push(new Exercise("layAndRemoveTiles", 3));
exercises.push(new Exercise("findShelters", 3));
