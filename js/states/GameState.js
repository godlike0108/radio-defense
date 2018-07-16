var SpaceShip = SpaceShip || {}

SpaceShip.GameState = {
  init () {
    this.CENTER = new Phaser.Point(this.game.world.centerX, this.game.world.centerY)
    // player settings
    this.ANG_VEL = 2
    this.ANG_TOL = this.game.math.degToRad(6) // 在此角度區間為靜止
    this.GUN_DIS = 90
    this.SHIELD_DIS = 90
    this.BULLET_SPEED = 500
    this.SHOOT_SPEED = Phaser.Timer.SECOND/5*2

    // enemy settings
    // enemy player distance
    this.ENEMY_GROUP = ['UFOs', 'meteors', 'carriers', 'smallmeteors', 'jets']
    this.ENEMY_BULLETS = ['UFOBullets', 'CarrierBullets']
    this.ENEMY_DIS = this.CENTER.distance(new Phaser.Point(0, 0))
    this.ENEMY_SPEED = 20

    // start physic engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload () {
    this.playerCoreTexture = SpaceShip.PlayerCoreTexture(this.game)
    this.playerTexture = SpaceShip.PlayerTexture(this.game)
    this.playerShieldTexture = SpaceShip.PlayerShieldTexture(this.game)
    this.playerGunTexture = SpaceShip.PlayerGunTexture(this.game)
    this.playerBulletTexture = SpaceShip.PlayerBulletTexture(this.game)
    // enemy textures
    this.UFOTexture = SpaceShip.UFOTexture(this.game)
    this.UFOBulletTexture = SpaceShip.UFOBulletTexture(this.game)
    this.MeteoriteTexture = SpaceShip.MeteoriteTexture(this.game)
    this.CarrierTexture = SpaceShip.CarrierTexture(this.game)

    // level data
    this.load.text('lv1', 'data/level/1.json')

  },

  create () {
    // create player core
    this.playerCore = this.game.add.sprite(this.CENTER.x, this.CENTER.y, this.playerCoreTexture)
    this.playerCore.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.playerCore)

    // create player
    this.player = this.game.add.sprite(this.CENTER.x, this.CENTER.y, this.playerTexture)
    this.player.anchor.setTo(0.5)

    // create player shield
    this.playerShield = this.game.add.sprite(this.CENTER.x - this.SHIELD_DIS, this.CENTER.y, this.playerShieldTexture)
    this.playerShield.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.playerShield)

    // create player gun
    this.playerGun = this.game.add.sprite(this.playerCore.x + this.GUN_DIS, this.playerCore.y, this.playerGunTexture)
    this.playerGun.anchor.setTo(0.5)
    this.playerGun.scale.setTo(0.8)
    this.game.physics.arcade.enable(this.playerGun)

    // create player bullet
    this.initPlayerBullets()
    this.bulletTimer = this.game.time.create(false)
    this.bulletTimer.loop(this.SHOOT_SPEED, this.createPlayerBullet, this)
    this.bulletTimer.start()

    // create enemies
    this.initEnemies()
    this.initEnemyBullets()

    this.loadLevel()
  },

  update () {
    // gun and shield rotation
    let pointerAngle = this.game.physics.arcade.angleToPointer(this.playerCore)
    let playerGunAngle = this.game.physics.arcade.angleBetween(this.playerCore, this.playerGun)
    
    if (pointerAngle - playerGunAngle > this.ANG_TOL/2 && pointerAngle - playerGunAngle <= Math.PI || pointerAngle - playerGunAngle < 0 && pointerAngle - playerGunAngle < -Math.PI) {
      this.playerGun.angle += this.ANG_VEL
      this.playerGun.position.rotate(this.playerCore.x, this.playerCore.y, this.ANG_VEL, true)

      this.playerShield.angle = this.playerGun.angle
      this.playerShield.position.rotate(this.playerCore.x, this.playerCore.y, this.ANG_VEL, true)
    } else if (pointerAngle - playerGunAngle < -this.ANG_TOL/2 && pointerAngle - playerGunAngle <= Math.PI || pointerAngle - playerGunAngle > 0 && pointerAngle - playerGunAngle > Math.PI) {
      this.playerGun.angle -= this.ANG_VEL
      this.playerGun.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)

      this.playerShield.angle = this.playerGun.angle
      this.playerShield.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)
    }

    // press W to shoot
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      this.bulletTimer.resume()
    } else {
      this.bulletTimer.pause()
    }

    this.ENEMY_GROUP.forEach(type => {
      // bullet and enemy collision detection
      this.game.physics.arcade.overlap(this[type], this.playerBullets, this.damageEnemy, null, this)
      // shield ane enemy collision detection
      this.game.physics.arcade.overlap(this.playerShield, this[type], this.killEnemy, null, this)
    })

    this.ENEMY_BULLETS.forEach(type => {
      // enemy bullet and shield
      this.game.physics.arcade.overlap(this.playerShield, this[type], this.killBullets, null, this)
    })

  },

  // custom
  initPlayerBullets () {
    this.playerBullets = this.add.group()
    this.playerBullets.enableBody = true
  },

  createPlayerBullet () {
    let bullet = this.playerBullets.getFirstExists(false)

    if(!bullet) {
      bullet = new SpaceShip.PlayerBullet(this.game, this.playerGun.x, this.playerGun.y, this.playerBulletTexture)
      this.playerBullets.add(bullet)
    } else {
      // reset position
      bullet.reset(this.playerGun.x, this.playerGun.y)
    }
    // set velocity
    this.game.physics.arcade.velocityFromRotation(this.playerGun.rotation, this.BULLET_SPEED, bullet.body.velocity)
    bullet.rotation = this.playerGun.rotation
  },

  initEnemies () {
    this.ENEMY_GROUP.forEach(type => {
      this[type] = this.add.group()
      this[type].enableBody = true
    })
  },

  initEnemyBullets () {
    this.ENEMY_BULLETS.forEach(type => {
      this[type] = this.add.group()
      this[type].enableBody = true
    })
  },

  createUFO () {
    let ufo = this.UFOs.getFirstExists(false)
    // 隨機決定位置
    let angle = this.game.rnd.angle()
    let position = new Phaser.Point(this.playerCore.x+this.ENEMY_DIS, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)

    if(!ufo) {
      ufo = new SpaceShip.UFO(this.game, position.x, position.y, this.ENEMY_SPEED, this.playerCore, this.UFOBullets)
      this.UFOs.add(ufo)
    } else {
      ufo.reset(position.x, position.y)
    }
  },

  createMeteor () {
    let meteor = this.meteors.getFirstExists(false)
    // 隨機決定位置
    let angle = this.game.rnd.angle()
    let position = new Phaser.Point(this.playerCore.x+this.ENEMY_DIS, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)

    if(!meteor) {
      meteor = new SpaceShip.Meteorite(this.game, position.x, position.y, this.ENEMY_SPEED, this.playerCore, this.smallmeteors)
      this.meteors.add(meteor)
    } else {
      meteor.reset(position.x, position.y)
    }
  },

  createCarrier () {
    let carrier = this.carriers.getFirstExists(false)
    // 隨機決定位置
    let angle = this.game.rnd.angle()
    let position = new Phaser.Point(this.playerCore.x+this.ENEMY_DIS, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)

    if(!carrier) {
      carrier = new SpaceShip.Carrier(this.game, position.x, position.y, this.ENEMY_SPEED, this.playerCore, this.jets, this.CarrierBullets)
      this.carriers.add(carrier)
    } else {
      carrier.reset(position.x, position.y)
    }
  },

  damageEnemy (enemy, bullet) {
    enemy.damage(1)
    bullet.kill()
  },

  killEnemy (shield, enemy) {
    enemy.damage(1000)
  },

  killBullets (shield, bullet) {
    bullet.kill()
  },

  loadLevel () {
    this.currentEnemyIndex = 0
    this.levelData = JSON.parse(this.game.cache.getText(`lv1`))
    this.scheduleNextEnemy()
  },

  scheduleNextEnemy () {
    let nextEnemy = this.levelData.enemies[this.currentEnemyIndex]

    if(nextEnemy) {
      let nextTime = Phaser.Timer.SECOND * nextEnemy.time - (this.currentEnemyIndex === 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex-1].time)
      this.nextEnemyTimer = this.game.time.events.add(nextTime, () => {
        switch(nextEnemy.type) {
          case 'ufo':
            this.createUFO()
            break
          case 'meteor':
            this.createMeteor()
            break
          case 'carrier':
            this.createCarrier()
        }

        this.currentEnemyIndex++
        this.scheduleNextEnemy()
      })
    }
  }
}