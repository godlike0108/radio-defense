var SpaceShip = SpaceShip || {}

SpaceShip.LaserTexture = function (game) {
  // player position
  let laser = game.add.graphics()
  let radius = 40

  // draw a circle
  laser.beginFill(0xFAEE66)
  laser.drawCircle(radius, radius, radius*2)
  laser.endFill()

  // create Texture
  let texture = laser.generateTexture()
  laser.destroy();
  return texture
}