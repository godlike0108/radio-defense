var SpaceShip = SpaceShip || {}

SpaceShip.PlayerGunTexture = function () {
  // player position
  let playerGunTexture = this.game.add.graphics()
  let center = new Phaser.Point(100, 100)
  let radius = 90
  let angle = -90
  let path = [0,50, 30,50, 30,30, 20,0, 10,0, 0,30, 0,50]

  // draw a gun shape polygun
  playerGunTexture.beginFill(0xFFFFFF)
  playerGunTexture.drawPolygon(path)
  playerGunTexture.endFill(0xFFFFFF)

  // create Texture
  let texture = playerGunTexture.generateTexture()
  playerGunTexture.destroy();
  return texture
}