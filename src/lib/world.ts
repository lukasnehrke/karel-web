interface Robot {
  x: number
  y: number
  direction: number
}

interface Box {
  x: number
  y: number
}

interface Wall {
  x: number
  y: number
  direction: number
}

export class World {

  public size: number
  public robot: Robot
  public boxes: Box[] = []
  public walls: Wall[] = []

  constructor (size: number, robotX: number, robotY: number, robotDirection: number) {
    this.size = size
    this.robot = { x: robotX, y: robotY, direction: robotDirection }
  }

  addBox (x: number, y: number) {
    this.boxes.push({ x, y })
  }

  addWall (x: number, y: number, direction: number) {
    const wall = { x, y, direction }
    const next = this.nextPosition(x, y, direction)
    if (this.walls.indexOf(wall) === -1) {
      this.walls.push({ x, y, direction })
      this.walls.push({ x: next.x, y: next.y, direction: (direction + 2) % 4 })
    }
  }

  moveForward () {
    if (this.wallAhead()) throw new Error('Karel ran into a wall!')
    if (this.boxAhead()) throw new Error('Karel ran into a box!')
    const next = this.nextPosition(this.robot.x, this.robot.y, this.robot.direction)
    if (!this.isInside(next.x, next.y)) throw new Error('Karel tried to leave the playing area!')
    this.robot = next
  }

  turnLeft () {
    this.robot.direction = (this.robot.direction - 1) % 4
  }

  turnRight () {
    this.robot.direction = (this.robot.direction + 1) % 4
  }

  turnAround () {
    this.robot.direction = (this.robot.direction + 2) % 4
  }

  frontIsClear () {
    return !this.boxAhead() && !this.wallAhead()
  }

  dropBeeper () {}

  pickBeeper () {}

  wallAhead () {
    const { x, y, direction } = this.nextPosition(this.robot.x, this.robot.y, this.robot.direction)
    return !this.isInside(x, y) || Boolean(this.walls.find(w => w.x === x && w.y === y && w.direction === (direction + 2) % 4))
  }

  boxAhead () {
    const { x, y } = this.nextPosition(this.robot.x, this.robot.y, this.robot.direction)
    return Boolean(this.boxes.find(b => b.x === x && b.y === y))
  }

  apply (world: World) {
    this.robot = world.robot
    this.boxes = world.boxes
    this.walls = world.walls
  }

  private isInside (x: number, y: number) {
    return x >= 0 && x <= this.size - 1 && y >= 0 && y <= this.size - 1
  }

  private nextPosition = (x: number, y: number, direction: number) => {
    switch (direction) {
      case 0:
        return { x, y: y - 1, direction }
      case 1:
        return { x: x + 1, y, direction }
      case 2:
        return { x, y: y + 1, direction }
      case 3:
        return { x: x - 1, y, direction }
      default:
        throw new Error('Invalid position')
    }
  }
}
