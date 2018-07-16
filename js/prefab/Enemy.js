var SpaceShip = SpaceShip || {}

SpaceShip.Enemy = class Enemy extends Phaser.Sprite {
  constructor (game, x, y, speed, target) {
    super(game, x, y)
    this.anchor.setTo(0.5)
    this.speed = speed
    this.target = target
  }

  reset (x, y) {
    super.reset(x, y)
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
  }
}