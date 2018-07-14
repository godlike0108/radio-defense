var SpaceShip = SpaceShip || {}

SpaceShip.PlayerTexture = function () {
  // player position
  let playerTexture = this.game.add.graphics()
  let center = new Phaser.Point(80, 80)
  let radius = 80
  let dashAmount = 120
  let space = 0.2

  // draw an outer arc
  playerTexture.lineStyle(1, 0xFFFFFF, 1)
  playerTexture.moveTo(center.x+radius, center.y)
  for(let i = 0; i < dashAmount; i+=2) {
    playerTexture.arc(center.x, center.y, radius, (Math.PI*2/dashAmount)*i, (Math.PI*2/dashAmount)*(i+1), false)
  }

  

  // create Texture
  let texture = playerTexture.generateTexture()
  playerTexture.destroy();
  return texture
}