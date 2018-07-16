var SpaceShip = SpaceShip || {}

SpaceShip.CarrierTexture = function (game) {
  let CarrierTexture = game.add.graphics()
  let size = 60
  let path = [0,0, 0,size, size,size/2, 0,0]

  // draw a gun shape polygun
  CarrierTexture.beginFill(0x3677BB)
  CarrierTexture.drawTriangle(path)
  CarrierTexture.endFill()

  // create Texture
  let texture = CarrierTexture.generateTexture()
  CarrierTexture.destroy();
  return texture
}