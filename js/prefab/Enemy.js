var SpaceShip = SpaceShip || {}

SpaceShip.Enemy = class Enemy extends Phaser.Sprite {
  constructor (game, x, y, speed, target, type) {
    super(game, x, y)

    this.anchor.setTo(0.5)
    this.speed = speed
    this.target = target
    this.type = type
  }

  reset (x, y, type) {
    super.reset(x, y)
    this.type = type
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
  }
}