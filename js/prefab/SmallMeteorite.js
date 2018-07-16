var SpaceShip = SpaceShip || {}

SpaceShip.SmallMeteorite = class SmallMeteorite extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target) {
    super(game, x, y, speed, target)
    this.health = 1
    this.loadTexture(SpaceShip.MeteoriteTexture(game))
    this.scale.setTo(0.6)
    this.type = 'smallmeteor'
  }

  update () {
    super.update()
  }
}