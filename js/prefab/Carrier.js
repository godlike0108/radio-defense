var SpaceShip = SpaceShip || {}

SpaceShip.Carrier = class Carrier extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target, group) {
    super(game, x, y, speed, target)
    this.health = 4
    this.loadTexture(SpaceShip.CarrierTexture(game))
    this.angle = this.position.angle(this.target, true)

    // shooting
    this.BULLET_SPEED = 80
    this.enemyTimer = this.game.time.create(false)
    this.enemyTimer.start()
    this.scheduleShooting()

    // create jets
    this.jets = group
    this.BROKE_DIS_MIN = 60
    this.BROKE_DIS_MAX = 120
    this.BROKE_ANG_MIN = 110
    this.BROKE_ANG_MAX = 160
    this.scheduleCreateJet()
  }

  update () {
    super.update()
  }

  damage (amount) {
    super.damage(amount)

    if (this.health <= 0) {
      this.enemyTimer.pause()
    }
  }

  reset (x, y) {
    super.reset(x, y)
    this.enemyTimer.resume()
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

  createJet () {
    let jet = this.jets.getFirstExists(false)

    if(!jet) {
      jet = new SpaceShip.Jet(this.game, this.x, this.y, this.speed, this.target)
      this.jets.add(jet)
    } else {
      jet.reset(this.x, this.y)
    }

    let rndDis = this.game.rnd.between(this.BROKE_DIS_MIN, this.BROKE_DIS_MAX)
    let rndAng = this.game.rnd.sign() * this.game.rnd.between(this.BROKE_ANG_MIN, this.BROKE_ANG_MAX)
    let newPos = new Phaser.Point(this.x+rndDis, this.y).rotate(this.x, this.y, this.position.angle(this.target, true) + rndAng, true)
    this.game.add.tween(jet).to({x: newPos.x, y: newPos.y}, 1000, null, true)
  }

  scheduleCreateJet () {
    this.createJet()
    this.enemyTimer.add(Phaser.Timer.SECOND*3, this.scheduleCreateJet, this)
  }
}