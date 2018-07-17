var SpaceShip = SpaceShip || {}

SpaceShip.UltimateTexture = function (game) {
  // player position
  let ult = game.add.graphics()
  let radius = 480

  // draw a circle
  ult.lineStyle(20, 0xF6AF5F, 1)
  ult.drawCircle(radius, radius, radius*2)

  // create Texture
  let texture = ult.generateTexture()
  ult.destroy();
  return texture
}