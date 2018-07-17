var SpaceShip = SpaceShip || {}

SpaceShip.PlayerEnduranceTexture = function (game) {
  // player position
  let EndurTexture = game.add.graphics()
  let width = 200
  let height = 10

  // draw a circle
  EndurTexture.beginFill(0xFAAF5C)
  EndurTexture.drawRect(0, 0, width, height)
  EndurTexture.endFill()

  // create Texture
  let texture = EndurTexture.generateTexture()
  EndurTexture.destroy();
  return texture
}