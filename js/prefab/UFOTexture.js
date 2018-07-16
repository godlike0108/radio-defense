var SpaceShip = SpaceShip || {}

SpaceShip.UFOTexture = function (game) {
  // player position
  let UFOTexture = game.add.graphics()
  let center = new Phaser.Point(30, 30)
  let radius = 30
  let lineEnd = new Phaser.Point(center.x, center.y - radius)

  // draw a circle
  UFOTexture.beginFill(0xF6AF5F)
  UFOTexture.drawCircle(center.x, center.y, radius*2)
  UFOTexture.endFill()

  // create Texture
  let texture = UFOTexture.generateTexture()
  UFOTexture.destroy();
  return texture
}