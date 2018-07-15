SpaceShip.Enemy = class Enemy extends Phaser.Sprite {
  constructor (game, x, y, texture, health, speed, target) {
    super(game, x, y, texture, health)

    this.anchor.setTo(0.5)
    this.health = health
    this.speed = speed
    this.target = target
  }

  reset (x, y, health, texture) {
    super.reset(x, y, health)
    this.loadTexture(texture)
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
  }
}