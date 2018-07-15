var SpaceShip = SpaceShip || {}

SpaceShip.UFO = class UFO extends SpaceShip.Enemy {
  constructor (game, x, y, texture, health, speed, target) {
    super(game, x, y, texture, health, speed, target)
      this.ANG_VEL = 0.5
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
    this.position.rotate(this.target.x, this.target.y, this.ANG_VEL, true)
  }
}