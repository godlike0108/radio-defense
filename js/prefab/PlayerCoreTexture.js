var SpaceShip = SpaceShip || {}

SpaceShip.PlayerCoreTexture = function (game) {
  // player position
  let coreTexture = game.add.graphics()
  let center = new Phaser.Point(50, 50)
  let radius = 50
  let lineEnd = new Phaser.Point(center.x, center.y - radius)

  // draw a circle
  coreTexture.lineStyle(10, 0xFFFFFF, 1)
  coreTexture.drawCircle(center.x, center.y, radius*2)

  // draw three line
  coreTexture.lineStyle(5, 0xFFFFFF, 1)
  coreTexture.moveTo(center.x, center.y)
  coreTexture.lineTo(lineEnd.x, lineEnd.y)

  lineEnd.rotate(center.x, center.y, 120, true)
  coreTexture.moveTo(center.x, center.y)
  coreTexture.lineTo(lineEnd.x, lineEnd.y)

  lineEnd.rotate(center.x, center.y, 120, true)
  coreTexture.moveTo(center.x, center.y)
  coreTexture.lineTo(lineEnd.x, lineEnd.y)

  // create Texture
  let texture = coreTexture.generateTexture()
  coreTexture.destroy();
  return texture
}