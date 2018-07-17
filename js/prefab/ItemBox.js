var SpaceShip = SpaceShip || {}

SpaceShip.ItemBox = class ItemBox extends Phaser.Sprite {
  constructor (game, x, y, key) {
    super(game, x, y, key)
    this.type = 'laser'
    this.anchor.setTo(0.5)
    this.scale.setTo(0.2)
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
  }

  reset (x, y) {
    super.reset(x, y)
  }
}