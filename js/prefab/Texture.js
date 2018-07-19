var SpaceShip = SpaceShip || {}

SpaceShip.Texture = function (key, obj, game) {

  let graph = game.add.graphics()
  DRAWER[key](graph, obj, game)
  let texture = graph.generateTexture()
  graph.destroy();

  return texture
}

const DRAWER = {}

DRAWER.shield = function (graph, {r, lineWidth, fill, range}, game) {
  let from = game.math.degToRad(180 - range/2)
  let to = game.math.degToRad(180 + range/2)
  graph.lineStyle(lineWidth, fill, 1)
  graph.arc(r, r, r, from, to)
  graph.lineStyle(lineWidth, 0x000000, 1)
  graph.arc(r, r, r, to, from)
}