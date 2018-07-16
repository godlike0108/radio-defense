var SpaceShip = SpaceShip || {}

SpaceShip.EnemyBullet = class EnemyBullet extends Phaser.Sprite {
  constructor (game, x, y, texture) {
    super(game, x, y, texture)

    this.anchor.setTo(0.5)
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
  }

  reset (x, y, texture) {
    super.reset(x, y)
    this.loadTexture(texture)
  }
}