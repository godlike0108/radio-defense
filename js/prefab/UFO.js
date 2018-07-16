var SpaceShip = SpaceShip || {}

SpaceShip.UFO = class UFO extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target, type, enemyBullets, bulletTexture) {
    super(game, x, y, speed, target, type)
    this.ANG_VEL = 0.1
    this.BULLET_SPEED = 50
    this.bullets = enemyBullets
    this.bulletTexture = bulletTexture
    this.health = 3
    this.loadTexture(SpaceShip.UFOTexture(game))

    // turret setting
    this.TURRET_DIS = 30
    this.turretPos = new Phaser.Point(this.x + this.TURRET_DIS ,this.y).rotate(this.x, this.y, this.position.angle(this.target, true), true)
    this.enemyTimer = this.game.time.create(false)
    this.enemyTimer.start()

    this.scheduleShooting()
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
    this.position.rotate(this.target.x, this.target.y, this.ANG_VEL, true)
    this.turretPos = new Phaser.Point(this.x + this.TURRET_DIS ,this.y).rotate(this.x, this.y, this.position.angle(this.target, true), true)
  }

  damage (amount) {
    super.damage(amount)

    if (this.health <= 0) {
      this.enemyTimer.pause()
    }
  }

  reset (x, y, type) {
    super.reset(x, y, type)
    this.enemyTimer.resume()
  }

  shoot () {
    let bullet = this.bullets.getFirstExists(false)
    if(!bullet) {
      bullet = new SpaceShip.EnemyBullet(this.game, this.turretPos.x, this.turretPos.y, this.bulletTexture)
      this.bullets.add(bullet)
    } else {
      bullet.reset(this.x, this.y, this.UFOBulletTexture)
    }
    this.game.physics.arcade.moveToObject(bullet, this.target, this.BULLET_SPEED)
  }

  scheduleShooting () {
    this.shoot()
    this.enemyTimer.add(Phaser.Timer.SECOND, this.scheduleShooting, this)
  }
}