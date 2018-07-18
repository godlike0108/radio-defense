var SpaceShip = SpaceShip || {}

SpaceShip.ItemBox = class ItemBox extends Phaser.Sprite {
  constructor (game, x, y, key) {
    super(game, x, y, key)
    this.type = key
    this.anchor.setTo(0.5)

    this.checkWorldBounds = true
    this.outOfBoundsKill = true
  }

  reset (x, y, key) {
    super.reset(x, y)
    this.type = key
    this.loadTexture(key)
  }
}