var SpaceShip = SpaceShip || {}

SpaceShip.CarrierBullet = class CarrierBullet extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y)
    this.loadTexture(SpaceShip.CarrierBulletTexture(this.game))
  }
}