var SpaceShip = SpaceShip || {}

SpaceShip.Meteorite = class Meteorite extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target, type, isChild) {
    super(game, x, y, speed, target)
    this.health = 1
    this.loadTexture(SpaceShip.MeteoriteTexture(game))
    this.isChild = isChild || false

    if (this.isChild) {
      this.scale.setTo(0.6)
    }
  }

  update () {
    super.update()
  }
}