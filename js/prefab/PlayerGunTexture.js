var SpaceShip = SpaceShip || {}

SpaceShip.PlayerGunTexture = function (game) {
  // player position
  let playerGunTexture = game.add.graphics()
  let center = new Phaser.Point(100, 100)
  let path = [0,30, 20,30, 50,20, 50,10, 20,0, 0,0, 0,30]

  // draw a gun shape polygun
  playerGunTexture.beginFill(0xFFFFFF)
  playerGunTexture.drawPolygon(path)
  playerGunTexture.endFill(0xFFFFFF)

  // create Texture
  let texture = playerGunTexture.generateTexture()
  playerGunTexture.destroy();
  return texture
}