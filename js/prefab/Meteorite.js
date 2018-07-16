var SpaceShip = SpaceShip || {}

SpaceShip.Meteorite = class Meteorite extends SpaceShip.Enemy {
  constructor (game, x, y, texture, health, speed, target) {
    super(game, x, y, texture, health, speed, target)
  }

  update () {
  }
}