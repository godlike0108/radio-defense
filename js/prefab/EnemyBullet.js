var SpaceShip = SpaceShip || {}

SpaceShip.EnemyBullet = class EnemyBullet extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y)

    this.anchor.setTo(0.5)
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
  }

  reset (x, y) {
    super.reset(x, y)
  }
}