var SpaceShip = SpaceShip || {}

SpaceShip.PlayerBulletTexture = function (game) {
  // player position
  let playerBulletTexture = game.add.graphics()
  let center = new Phaser.Point(100, 100)
  let path = [0,0, 0,6, 10,6, 15,3, 10,0, 0,0]

  // draw a gun shape polygun
  playerBulletTexture.beginFill(0xFFFFFF)
  playerBulletTexture.drawPolygon(path)
  playerBulletTexture.endFill(0xFFFFFF)

  // create Texture
  let texture = playerBulletTexture.generateTexture()
  playerBulletTexture.destroy();
  return texture
}
