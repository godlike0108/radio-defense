var SpaceShip = SpaceShip || {}

SpaceShip.MeteoriteTexture = function (game) {
  const TOR = 5
  const SIZE = 60
  let MeteoriteTexture = game.add.graphics()

  // generate random shape

  let path = []

  path.push(0, 0)
  path.push(0, game.rnd.between(TOR, SIZE))
  path.push(game.rnd.between(TOR, SIZE), SIZE)
  path.push(SIZE, SIZE)
  path.push(SIZE, game.rnd.between(TOR, SIZE))
  path.push(game.rnd.between(TOR, SIZE), 0)
  path.push(0, 0)


  // draw a gun shape polygun
  MeteoriteTexture.beginFill(0xE8465D)
  MeteoriteTexture.drawPolygon(path)
  MeteoriteTexture.endFill(0xE8465D)

  // create Texture
  let texture = MeteoriteTexture.generateTexture()
  MeteoriteTexture.destroy();
  return texture
}