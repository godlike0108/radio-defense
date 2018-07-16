var SpaceShip = SpaceShip || {}

SpaceShip.UFOBulletTexture = function () {
  let UFOBulletTexture = this.game.add.graphics()
  let center = 10
  let radius = 5

  // draw a gun shape polygun
  UFOBulletTexture.beginFill(0xF6AF5F)
  UFOBulletTexture.drawCircle(center.x, center.y, radius*2)
  UFOBulletTexture.endFill(0xF6AF5F)

  // create Texture
  let texture = UFOBulletTexture.generateTexture()
  UFOBulletTexture.destroy();
  return texture
}