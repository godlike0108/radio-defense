var SpaceShip = SpaceShip || {}

SpaceShip.UFOBullet = class UFOBullet extends SpaceShip.EnemyBullet {
  constructor (game, x, y) {
    super(game, x, y)
    this.loadTexture(SpaceShip.UFOBulletTexture(this.game))
  }
}