var SpaceShip = SpaceShip || {}

SpaceShip.PlayerBullet = class PlayerBullet extends Phaser.Sprite {
  constructor (game, x, y, texture) {
    super(game, x, y, texture)

    this.anchor.setTo(0.5)
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
  }
}