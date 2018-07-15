SpaceShip.Enemy = class Enemy extends Phaser.Sprite {
  constructor (game, x, y, key, health, speed, target) {
    super(game, x, y, key, health)

    this.anchor.setTo(0.5)
    this.health = health
    this.speed = speed
    this.target = target
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
  }
}