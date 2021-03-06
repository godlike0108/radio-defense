var SpaceShip = SpaceShip || {}

SpaceShip.SmallMeteorite = class SmallMeteorite extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target, itemBoxes) {
    super(game, x, y, speed, target, itemBoxes)
    this.health = 1
    this.loadTexture(SpaceShip.MeteoriteTexture(game))
    this.scale.setTo(0.6)
  }

  update () {
    super.update()
  }
}