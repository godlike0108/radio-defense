var SpaceShip = SpaceShip || {}

SpaceShip.Jet = class Jet extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target) {
    super(game, x, y, speed, target)
    this.health = 1
    this.loadTexture(SpaceShip.CarrierTexture(game))
    this.angle = this.position.angle(this.target, true)
    this.scale.setTo(0.4)
  }

  update () {
    super.update()
  }

  reset (x, y) {
    super.reset(x, y)
    this.health = 1
    this.angle = this.position.angle(this.target, true)
  }
}