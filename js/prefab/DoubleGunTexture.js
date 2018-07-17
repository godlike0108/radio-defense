var SpaceShip = SpaceShip || {}

SpaceShip.DoubleGunTexture = function (game) {
  // player position
  let dbGun = game.add.graphics()
  let path = [0,0, 0,80, 20,80, 50,65, 20,50, 20,30, 50,15, 20,0, 0,0]

  // draw a gun shape polygun
  dbGun.beginFill(0xFFFFFF)
  dbGun.drawPolygon(path)
  dbGun.endFill(0xFFFFFF)

  // create Texture
  let texture = dbGun.generateTexture()
  dbGun.destroy();
  return texture
}