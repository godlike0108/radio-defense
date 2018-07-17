var SpaceShip = SpaceShip || {}

SpaceShip.GameState = {
  init () {
    this.CENTER = new Phaser.Point(this.game.world.centerX, this.game.world.centerY)
    // player settings
    this.ANG_VEL = 2
    this.ANG_TOL = this.game.math.degToRad(6) // 在此角度區間為靜止
    this.GUN_DIS = 90
    this.SHIELD_DIS = 100
    this.SHIELD_RNG = 60
    this.BULLET_SPEED = 500
    this.SHOOT_SPEED = Phaser.Timer.SECOND/5*2
    this.PLAYER_HEALTH = 3
    this.PLAYER_ENDUR = 1
    this.ENDUR_RECOVER_RATE = 1

    // player boosts
    this.SHIELD_RNG_BIG = 180
    this.SHIELD_BOOST_TIME = 10

    // enemy settings
    // enemy player distance
    this.ENEMY_GROUP = ['UFOs', 'meteors', 'carriers', 'smallmeteors', 'jets']
    this.ENEMY_BULLETS = ['UFOBullets', 'CarrierBullets']
    this.ENEMY_DIS = this.CENTER.distance(new Phaser.Point(0, 0))
    this.ENEMY_SPEED = 20
    this.ENEMY_DAMAGE = 0.34

    // start physic engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload () {
    // player texture
    this.playerCoreTexture = SpaceShip.PlayerCoreTexture(this.game)
    this.playerTexture = SpaceShip.PlayerTexture(this.game)
    this.playerShieldTexture = SpaceShip.PlayerShieldTexture(this.game, this.SHIELD_RNG)
    this.playerBigShieldTexture = SpaceShip.PlayerShieldTexture(this.game, this.SHIELD_RNG_BIG)
    this.playerGunTexture = SpaceShip.PlayerGunTexture(this.game)
    this.playerBulletTexture = SpaceShip.PlayerBulletTexture(this.game)
    // enemy textures
    this.UFOTexture = SpaceShip.UFOTexture(this.game)
    this.UFOBulletTexture = SpaceShip.UFOBulletTexture(this.game)
    this.MeteoriteTexture = SpaceShip.MeteoriteTexture(this.game)
    this.CarrierTexture = SpaceShip.CarrierTexture(this.game)
    // item texture
    this.load.image('itemBox', 'assets/box.png')

    // UI texture
    this.load.image('heart', 'assets/heart.png')
    this.playerEndurTexture = SpaceShip.PlayerEnduranceTexture(this.game)

    // level data
    this.load.text('lv1', 'data/level/1.json')

  },

  create () {
    // create player core
    this.playerCore = this.game.add.sprite(this.CENTER.x, this.CENTER.y, this.playerCoreTexture)
    this.playerCore.anchor.setTo(0.5)
    this.game.physics.arcade.enable(this.playerCore)
    this.playerCore.health = this.PLAYER_HEALTH

    // create player
    this.player = this.game.add.sprite(this.CENTER.x, this.CENTER.y, this.playerTexture)
    this.player.anchor.setTo(0.5)

    // create player shield
    this.playerShield = this.game.add.sprite(this.CENTER.x - this.SHIELD_DIS, this.CENTER.y, this.playerShieldTexture)
    this.playerShield.anchor.setTo(0, 0.5)
    this.game.physics.arcade.enable(this.playerShield)

    // create player big shield and hide
    this.playerBigShield = this.game.add.sprite(this.CENTER.x - this.SHIELD_DIS, this.CENTER.y, this.playerBigShieldTexture)
    this.playerBigShield.anchor.setTo(0, 0.5)
    this.game.physics.arcade.enable(this.playerBigShield)
    this.playerBigShield.kill()

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

    // create itemBoxes
    this.initItemBoxes()

    // create UIs
    this.initUI()

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
      this.playerBigShield.angle = this.playerGun.angle
      this.playerBigShield.position.rotate(this.playerCore.x, this.playerCore.y, this.ANG_VEL, true)
    } else if (pointerAngle - playerGunAngle < -this.ANG_TOL/2 && pointerAngle - playerGunAngle <= Math.PI || pointerAngle - playerGunAngle > 0 && pointerAngle - playerGunAngle > Math.PI) {
      this.playerGun.angle -= this.ANG_VEL
      this.playerGun.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)

      this.playerShield.angle = this.playerGun.angle
      this.playerShield.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)
      this.playerBigShield.angle = this.playerGun.angle
      this.playerBigShield.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)
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
      this.game.physics.arcade.overlap(this.playerBigShield, this[type], this.killEnemy, null, this)
      // enemy and player
      this.game.physics.arcade.overlap(this.playerCore, this[type], this.damagePlayer, null, this)
    })

    this.ENEMY_BULLETS.forEach(type => {
      // enemy bullet and shield
      this.game.physics.arcade.overlap(this.playerShield, this[type], this.killBullets, null, this)
      this.game.physics.arcade.overlap(this.playerBigShield, this[type], this.killBullets, null, this)
      // enemy bullet and core
      this.game.physics.arcade.overlap(this.playerCore, this[type], this.damagePlayer, null, this)
    })

    // itemBoxes and playerBullets collision
    this.game.physics.arcade.overlap(this.itemBoxes, this.playerBullets, this.eatItemBox, null, this)
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
      ufo = new SpaceShip.UFO(this.game, position.x, position.y, this.ENEMY_SPEED, this.playerCore, this.itemBoxes, this.UFOBullets)
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
      meteor = new SpaceShip.Meteorite(this.game, position.x, position.y, this.ENEMY_SPEED, this.playerCore, this.itemBoxes, this.smallmeteors)
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
      carrier = new SpaceShip.Carrier(this.game, position.x, position.y, this.ENEMY_SPEED, this.playerCore, this.itemBoxes, this.jets, this.CarrierBullets)
      this.carriers.add(carrier)
    } else {
      carrier.reset(position.x, position.y)
    }
  },

  initItemBoxes () {
    this.itemBoxes = this.add.group()
    this.itemBoxes.enableBody = true
  },

  eatItemBox (itemBox, bullet) {
    bullet.kill()
    itemBox.kill()
    // player boost
    this.playerBoost(itemBox.type)
  },

  playerBoost(boxType) {
    switch(boxType) {
      case 'shield':
        this.shieldBoost()
        break
    }
  },

  shieldBoost() {
    this.playerShield.kill()
    this.playerBigShield.revive()
    this.game.time.events.add(Phaser.Timer.SECOND*this.SHIELD_BOOST_TIME, function() {
      this.playerShield.revive()
      this.playerBigShield.kill()
    }, this)
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

  damagePlayer(playerCore, enemyThings) {
    enemyThings.kill()
    // damage player endurance
    if(this.currentEndur > this.ENEMY_DAMAGE) {
      this.currentEndur -= this.ENEMY_DAMAGE
      this.tweenEndur = this.game.add.tween(this.endurance.scale).to({x: this.currentEndur}, Phaser.Timer.SECOND)
      this.tweenEndur.start()
    } else if (playerCore.health > 1) {
      // fill endurance
      this.currentEndur = this.PLAYER_ENDUR
      this.tweenEndur = this.game.add.tween(this.endurance.scale).to({x: 0}, Phaser.Timer.SECOND)
      this.tweenEndur.start()
      this.tweenEndur.onComplete.addOnce(() => {
        this.tweenEndur.pause()
        this.currentEndur = this.PLAYER_ENDUR
        this.endurance.scale.x = this.currentEndur
      })
      this.endurance.scale.x = this.PLAYER_ENDUR
      // player get damage
      playerCore.damage(1)
      this.currentPlayerLife[playerCore.health].kill()
    } else {
      this.tweenEndur = this.game.add.tween(this.endurance.scale).to({x: 0}, Phaser.Timer.SECOND)
      this.tweenEndur.start()
      // player get damage
      playerCore.damage(1)
      this.currentPlayerLife[playerCore.health].kill()
      this.gameOver()
    }
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
  },

  // init UIs
  initUI () {
    this.LIFE_INIT_POS = new Phaser.Point(this.game.world.width*0.95, this.game.world.height*0.1)
    this.initHeart()
    this.initEndurance()
  },

  // init hearts
  initHeart () {
    // check player life
    this.HEART_SPACE = 10
    this.HEART_SCALE = 0.5
    this.HEART_SIZE = this.game.cache.getImage('heart').width * this.HEART_SCALE
    this.currentPlayerLife = []

    let heartPos = new Phaser.Point(this.LIFE_INIT_POS.x, this.LIFE_INIT_POS.y)
    // create heart images
    for(let i = 0; i < this.PLAYER_HEALTH; i++) {
      let heart = this.game.add.image(heartPos.x - this.HEART_SIZE, heartPos.y, 'heart')
      heart.scale.setTo(this.HEART_SCALE)
      this.currentPlayerLife.push(heart)
      heartPos.x -= (this.HEART_SPACE + this.HEART_SIZE)
    }
  },

  // init endurance
  initEndurance () {
    let endurPos = this.LIFE_INIT_POS.subtract(0, this.HEART_SIZE/2 + this.HEART_SPACE)
    this.endurance = this.game.add.image(endurPos.x, endurPos.y, this.playerEndurTexture)
    this.endurance.anchor.setTo(1, 0)

    this.currentEndur = this.PLAYER_ENDUR
    // init recover timer
    this.game.time.events.loop(this.ENDUR_RECOVER_RATE*Phaser.Timer.SECOND, () => {
      if(this.currentEndur < 1) {
        this.currentEndur += 0.01
        this.endurance.scale.x = this.currentEndur
      }
    }, this)
  },

  // game Over
  gameOver () {
    console.log('game over')
  },
}