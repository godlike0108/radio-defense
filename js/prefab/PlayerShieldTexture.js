var SpaceShip = SpaceShip || {}

SpaceShip.PlayerShieldTexture = function () {
  // player position
  let playerShieldTexture = this.game.add.graphics()
  let center = new Phaser.Point(100, 100)
  let radius = 90
  let angle = 180
  let range = 60

  // draw an outer arc
  playerShieldTexture.lineStyle(5, 0xFFFFFF, 1)
  playerShieldTexture.arc(center.x, center.y, radius, this.game.math.degToRad(angle - range/2), this.game.math.degToRad(angle + range/2), false)

  // create Texture
  let texture = playerShieldTexture.generateTexture()
  playerShieldTexture.destroy();
  return texture
}