var SpaceShip = SpaceShip || {}

SpaceShip.CarrierBulletTexture = function (game) {
  let CarrierBulletTexture = game.add.graphics()
  let center = 10
  let radius = 5

  // draw a gun shape polygun
  CarrierBulletTexture.beginFill(0x3677BB)
  CarrierBulletTexture.drawCircle(center.x, center.y, radius*2)
  CarrierBulletTexture.endFill(0x3677BB)

  // create Texture
  let texture = CarrierBulletTexture.generateTexture()
  CarrierBulletTexture.destroy();
  return texture
}