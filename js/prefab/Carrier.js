var SpaceShip = SpaceShip || {}

SpaceShip.Carrier = class Carrier extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target, type, group) {
    super(game, x, y, speed, target, type)
    this.health = 4
    this.loadTexture(SpaceShip.CarrierTexture(game))
    this.group = group
    this.BULLET_SPEED = 80

    this.enemyTimer = this.game.time.create(false)
    this.enemyTimer.start()
    this.scheduleShooting()
  }

  update () {
    super.update()
  }

  shoot () {
    let bullet = this.bullets.getFirstExists(false)
    if(!bullet) {
      bullet = new SpaceShip.CarrierBullet(this.game, this.x, this.y)
      this.bullets.add(bullet)
    } else {
      bullet.reset(this.x, this.y)
    }
    this.game.physics.arcade.moveToObject(bullet, this.target, this.BULLET_SPEED)
  }

  scheduleShooting () {
    this.shoot()
    this.enemyTimer.add(Phaser.Timer.SECOND, this.scheduleShooting, this)
  }
}