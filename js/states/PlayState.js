var SpaceShip = SpaceShip || {}

SpaceShip.PlayState = {
  init () {
    // game settings
    this.currentLevel = 1
    this.totalLevel = 3
    this.allIn = false
    this.allOut = false

    this.CENTER = new Phaser.Point(this.game.world.centerX, this.game.world.centerY)
    // player settings
    this.ANG_VEL = 2
    this.ANG_TOL = this.game.math.degToRad(6) // 在此角度區間為靜止
    this.GUN_DIS = 90
    this.shieldRange = 90
    this.BULLET_SPEED = 500
    this.SHOOT_SPEED = Phaser.Timer.SECOND/5*2
    this.PLAYER_HEART = 3
    this.PLAYER_ENDUR = 1
    this.ENDUR_RECOVER_RATE = 1
    this.ULT_SPEED = Phaser.Timer.SECOND
    this.weaponMode = 'bullet'

    // player boosts
    this.SHIELD_BOOST_TIME = Phaser.Timer.SECOND*5
    this.DOUBLE_GUN_DIS = 30
    this.GUN_BOOST_TIME = Phaser.Timer.SECOND*10
    this.LASER_DIS = 20
    this.LASER_POINT = 10
    this.LASER_BOOST_TIME = Phaser.Timer.SECOND*5

    // enemy settings
    this.ENEMY_GROUP = ['UFOs', 'meteors', 'carriers', 'smallmeteors', 'jets']
    this.ENEMY_BULLETS = ['UFOBullets', 'CarrierBullets']
    this.SCREEN_DIS = this.CENTER.distance(new Phaser.Point(0, 0))
    this.ENEMY_SPEED = 20
    this.ENEMY_DAMAGE = 0.34

    // UI needed
    // collected batteries
    this.batteries = 0
    this.COUNTDOWN = 60

    // start physic engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload () {
    // player texture
    this.playerCoreTexture = SpaceShip.PlayerCoreTexture(this.game)
    this.playerTexture = SpaceShip.PlayerTexture(this.game)

    let SHIELD = {r: 100, lineWidth: 5, fill: 0xFFFFFF, range: 90}
    this.playerShieldTexture = SpaceShip.Texture('shield', SHIELD, this.game)
    this.playerBigShieldTexture = SpaceShip.PlayerShieldTexture(this.game, 180)
    this.playerGunTexture = SpaceShip.PlayerGunTexture(this.game)
    this.playerBulletTexture = SpaceShip.PlayerBulletTexture(this.game)
    // player boost texture
    this.DoubleGunTexture = SpaceShip.DoubleGunTexture(this.game)
    this.UltTexture = SpaceShip.UltimateTexture(this.game)
    this.LaserTexture = SpaceShip.LaserTexture(this.game)

    this.UFOTexture = SpaceShip.UFOTexture(this.game)
    this.UFOBulletTexture = SpaceShip.UFOBulletTexture(this.game)
    this.MeteoriteTexture = SpaceShip.MeteoriteTexture(this.game)
    this.CarrierTexture = SpaceShip.CarrierTexture(this.game)
    // item texture
    this.load.image('itemDouble', 'assets/item-double.png')
    this.load.image('itemHeart', 'assets/item-heart.png')
    this.load.image('itemLaser', 'assets/item-laser.png')
    this.load.image('itemUlt', 'assets/item-ult.png')
    this.load.image('itemShield', 'assets/item-shield.png')
    this.load.image('itemWave', 'assets/item-wave.png')

    // UI texture
    this.load.image('heart', 'assets/heart.png')
    this.playerEndurTexture = SpaceShip.PlayerEnduranceTexture(this.game)

    // level data
    this.load.text('lv1', 'data/level/1.json')
    this.load.text('lv2', 'data/level/2.json')
    this.load.text('lv3', 'data/level/3.json')

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
    this.playerShield = this.game.add.sprite(this.CENTER.x, this.CENTER.y, this.playerShieldTexture)
    this.playerShield.anchor.setTo(0.5, 0.5)
    this.game.physics.arcade.enable(this.playerShield)
    this.playerShield.body.setCircle(100)

    // create player big shield and hide
    this.playerBigShield = this.game.add.sprite(this.CENTER.x - this.SHIELD_DIS, this.CENTER.y, this.BigShieldTexture)
    this.playerBigShield.anchor.setTo(0, 0.5)
    this.game.physics.arcade.enable(this.playerBigShield)
    this.playerBigShield.kill()

    // create player gun
    this.playerGun = this.game.add.sprite(this.playerCore.x + this.GUN_DIS, this.playerCore.y, this.playerGunTexture)
    this.playerGun.anchor.setTo(0.5)
    this.playerGun.scale.setTo(0.8)

    // create player double gun
    this.playerDoubleGun = this.game.add.sprite(this.playerCore.x + this.GUN_DIS, this.playerCore.y, this.DoubleGunTexture)
    this.playerDoubleGun.anchor.setTo(0.5)
    this.playerDoubleGun.scale.setTo(0.8)
    this.playerDoubleGun.kill()

    // create ultimate
    this.ult = this.game.add.sprite(this.playerCore.x, this.playerCore.y, this.UltTexture)
    this.ult.anchor.setTo(0.5)
    this.ult.scale.setTo(0.2)
    this.game.physics.arcade.enable(this.ult)
    this.ult.kill()

    // create player bullet
    this.initPlayerBullets()
    this.bulletTimer = this.game.time.create(false)
    this.bulletTimer.loop(this.SHOOT_SPEED, this.createPlayerBullet, this)
    this.bulletTimer.start()

    // create player laser
    this.initLaser()

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
    
    if (pointerAngle - playerGunAngle > this.ANG_TOL/2 && pointerAngle - playerGunAngle <= Math.PI || pointerAngle - playerGunAngle < -Math.PI) {
      this.playerGun.angle += this.ANG_VEL
      this.playerGun.position.rotate(this.playerCore.x, this.playerCore.y, this.ANG_VEL, true)
      this.playerDoubleGun.angle = this.playerGun.angle
      this.playerDoubleGun.position = this.playerGun.position.clone()

      this.playerShield.angle = this.playerGun.angle
      this.playerShield.position.rotate(this.playerCore.x, this.playerCore.y, this.ANG_VEL, true)
    } else if (pointerAngle - playerGunAngle < -this.ANG_TOL/2 && pointerAngle - playerGunAngle <= Math.PI || pointerAngle - playerGunAngle > Math.PI) {
      this.playerGun.angle -= this.ANG_VEL
      this.playerGun.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)
      this.playerDoubleGun.angle = this.playerGun.angle
      this.playerDoubleGun.position = this.playerGun.position.clone()

      this.playerShield.angle = this.playerGun.angle
      this.playerShield.position.rotate(this.playerCore.x, this.playerCore.y, -this.ANG_VEL, true)
    }

    // press W to shoot
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      if(this.weaponMode === 'laser') {
        this.createLaser()
      } else if (this.weaponMode === 'bullet') {
        this.bulletTimer.resume()
      }
    } else {
      this.killLaser()
      this.bulletTimer.pause()
    }

    this.ENEMY_GROUP.forEach(type => {
      // bullet and enemy collision detection
      this.game.physics.arcade.overlap(this[type], this.playerBullets, this.damageEnemy, null, this)
      // shield ane enemy collision detection
      this.game.physics.arcade.overlap(this.playerShield, this[type], this.killEnemy, this.shieldRangeCheck, this)
      // enemy and player
      this.game.physics.arcade.overlap(this.playerCore, this[type], this.damagePlayer, null, this)
      // enemy and ult
      this.game.physics.arcade.overlap(this.ult, this[type], this.killEnemy, null, this)
      // enemy and laser
      this.game.physics.arcade.overlap(this.laser, this[type], this.killEnemy, null, this)
    })

    this.ENEMY_BULLETS.forEach(type => {
      // enemy bullet and shield
      this.game.physics.arcade.overlap(this.playerShield, this[type], this.killBullets, this.shieldRangeCheck, this)
      // enemy bullet and core
      this.game.physics.arcade.overlap(this.playerCore, this[type], this.damagePlayer, null, this)
    })

    // itemBoxes and playerBullets collision
    this.game.physics.arcade.overlap(this.itemBoxes, this.playerBullets, this.eatItemBox, null, this)
    this.game.physics.arcade.overlap(this.itemBoxes, this.laser, this.eatItemBox, null, this)
  },

  // custom
  shieldRangeCheck (shield, enemyThing) {
    let enemyAngle = this.game.physics.arcade.angleBetween(this.playerCore, enemyThing)
    let angle = (shield.angle + 180 > 180) ? shield.angle - 180 : shield.angle + 180
    let shieldAngle = this.game.math.degToRad(angle)
    let delta = enemyAngle - shieldAngle
    let rng = this.game.math.degToRad(this.shieldRange)
    //console.log(delta < rng/2, delta > (Math.PI*2-rng/2), delta < (rng/2 - Math.PI*2))
    if(delta < rng/2 || delta > (Math.PI*2-rng/2) || delta < (rng/2 - Math.PI*2)) {
      return true
    } else {
      return false
    }
  },

  initPlayerBullets () {
    this.playerBullets = this.add.group()
    this.playerBullets.enableBody = true
  },

  createPlayerBullet () {
    if(this.playerGun.exists) {
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
    }

    if(this.playerDoubleGun.exists) {
      let dir = this.playerDoubleGun.position.clone().rperp().normalize().multiply(20, 20)
      let gunPoints = [
        this.playerDoubleGun.position.clone().add(dir.x, dir.y),
        this.playerDoubleGun.position.clone().subtract(dir.x, dir.y)
      ]
      for(let i=0; i<gunPoints.length; i++) {
        let bullet = this.playerBullets.getFirstExists(false)
        if(!bullet) {
          bullet = new SpaceShip.PlayerBullet(this.game, gunPoints[i].x, gunPoints[i].y, this.playerBulletTexture)
          this.playerBullets.add(bullet)
        } else {
          // reset position
          bullet.reset(gunPoints[i].x, gunPoints[i].y)
        }
        // set velocity
        this.game.physics.arcade.velocityFromRotation(this.playerDoubleGun.rotation, this.BULLET_SPEED, bullet.body.velocity)
        bullet.rotation = this.playerDoubleGun.rotation
      }
    }
  },

  initLaser () {
    this.laser = this.add.group()
    this.laser.enableBody = true
  },

  createLaser () {
    // 取得槍的角度做出單位向量
    let unit = new Phaser.Point(1,0).rotate(0, 0, this.playerGun.rotation).multiply(this.LASER_DIS, this.LASER_DIS)
    let firstPoint = this.playerGun.position.clone()
    // 用固定角度做很多向量點
    let laserPoints = []
    for(let i=0; i<this.LASER_POINT; i++) {
      firstPoint.add(unit.x, unit.y)
      laserPoints.push(firstPoint.add(unit.x, unit.y).clone())
    }
    laserPoints.forEach(point => {
      let laserSec = this.laser.getFirstExists(false)
      if(!laserSec) {
        laserSec = new Phaser.Sprite(this.game, point.x, point.y, this.LaserTexture)
        laserSec.anchor.setTo(0.5)
        this.laser.add(laserSec)
      } else {
        laserSec.reset(point.x, point.y)
      }
    })
    this.game.time.events.add(100, this.killLaser, this)
  },

  killLaser () {
    this.laser.killAll()
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
    let position = new Phaser.Point(this.playerCore.x+this.SCREEN_DIS, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)

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
    let position = new Phaser.Point(this.playerCore.x+this.SCREEN_DIS, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)

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
    let position = new Phaser.Point(this.playerCore.x+this.SCREEN_DIS, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)

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
      case 'itemShield':
        this.shieldBoost()
        break
      case 'itemHeart':
        this.healHeart()
        break
      case 'itemDouble':
        this.doubleGunBoost()
        break
      case 'itemUlt':
        this.releaseUlt()
        break
      case 'itemLaser':
        this.laserBoost()
        break
      case 'itemWave':
        this.waveBoost()
    }
  },

  shieldBoost() {
    this.playerShield.loadTexture(this.playerBigShieldTexture)
    this.shieldRange = 180
    this.game.time.events.add(this.SHIELD_BOOST_TIME, function() {
      this.playerShield.loadTexture(this.playerShieldTexture)
      this.shieldRange = 90
    }, this)
  },

  doubleGunBoost() {
    this.playerGun.kill()
    this.playerDoubleGun.revive()
    this.game.time.events.add(this.GUN_BOOST_TIME, function() {
      this.playerGun.revive()
      this.playerDoubleGun.kill()
    }, this)
  },

  releaseUlt() {
    this.ult.revive()
    this.tweenUlt = this.game.add.tween(this.ult.scale).to({x: 1, y: 1}, this.ULT_SPEED)
    this.tweenUlt.start()
    this.tweenUlt.onComplete.addOnce(() => {
      this.ult.scale.setTo(0.2)
      this.ult.kill()
    })
  },

  laserBoost() {
    // 切換雷射
    this.bulletTimer.pause()
    this.weaponMode = 'laser'
    this.game.time.events.add(this.LASER_BOOST_TIME, function() {
      this.weaponMode = 'bullet'
    }, this)
  },

  waveBoost() {
    console.log('wave')
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
    enemyThings.damage(1000)
    // damage player endurance
    if(this.currentEndur > this.ENEMY_DAMAGE) {
      this.currentEndur -= this.ENEMY_DAMAGE
      this.tweenEndur = this.game.add.tween(this.endurance.scale).to({x: this.currentEndur}, Phaser.Timer.SECOND)
      this.tweenEndur.start()
    } else if (this.currentHeart > 1) {
      // fill endurance
      this.currentEndur = this.PLAYER_ENDUR
      this.tweenEndur = this.game.add.tween(this.endurance.scale).to({x: 0}, Phaser.Timer.SECOND)
      this.tweenEndur.start()
      this.tweenEndur.onComplete.addOnce(() => {
        this.tweenEndur.pause()
        this.currentEndur = this.PLAYER_ENDUR
        this.endurance.scale.x = this.currentEndur
      })
      // player get damage
      this.damageHeart()
    } else {
      // player get damage
      this.damageHeart()
      this.gameOver()
    }
  },

  loadLevel () {
    let hasLevel = this.game.cache.checkTextKey(`lv${this.currentLevel}`)
    if(!hasLevel) {
      this.gameOver()
    } else {
      this.levelData = JSON.parse(this.game.cache.getText(`lv${this.currentLevel}`))
      this.currentEnemyIndex = 0
      this.allIn = false
      this.allOut = false
      this.showWaveNotice()
      this.scheduleNextEnemy()
    }
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
    } else {
      this.allIn = true
      this.levelEndCheck()
    }
  },

  levelEndCheck () {
    if(this.allIn && this.allOut) {
      this.currentLevel++
      this.loadLevel()
    } else {
      this.game.time.events.add(1000, function() {
        if(this.allOutCheck()) {
          this.allOut = true
        }
        this.levelEndCheck()
      }, this)
    }
  },

  allOutCheck () {
    return this.ENEMY_GROUP.every(type => {
      return this[type].children.every(enemy => !enemy.exists)
    })
  },

  // init UIs
  initUI () {
    this.LIFE_INIT_POS = new Phaser.Point(this.game.world.width*0.95, this.game.world.height*0.1)
    this.initHeart()
    this.initEndurance()
    this.initBattery()
    this.initCountdown()
    this.initWaveNotice()
  },

  // init hearts
  initHeart () {
    // check player life
    this.HEART_SPACE = 10
    this.HEART_SCALE = 0.5
    this.HEART_SIZE = this.game.cache.getImage('heart').width * this.HEART_SCALE
    this.currentPlayerLife = []
    this.currentHeart = this.PLAYER_HEART

    let heartPos = new Phaser.Point(this.LIFE_INIT_POS.x, this.LIFE_INIT_POS.y)
    // create heart images
    for(let i = 0; i < this.PLAYER_HEART; i++) {
      let heart = this.game.add.image(heartPos.x - this.HEART_SIZE, heartPos.y, 'heart')
      heart.scale.setTo(this.HEART_SCALE)
      this.currentPlayerLife.push(heart)
      heartPos.x -= (this.HEART_SPACE + this.HEART_SIZE)
    }
  },

  // update hearts
  damageHeart () {
    if (this.currentHeart > 0) {
      this.currentHeart--
      this.currentPlayerLife[this.currentHeart].kill()
    }
  },

  healHeart () {
    if (this.currentHeart < this.PLAYER_HEART) {
      this.currentPlayerLife[this.currentHeart].revive()
      this.currentHeart++
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

  // init battery ui
  initBattery () {
    let style = {
      font: '18pt Arial',
      fill: '#fff',
    }
    let subBat = this.game.add.text(this.game.world.width*0.95, this.game.world.height*0.85, '已回收', style)
    subBat.anchor.setTo(1, 0.5)
    this.batteryText = this.game.add.text(this.game.world.width*0.95, this.game.world.height*0.9, `${this.batteries} 顆能量電池`,style)
    this.batteryText.anchor.setTo(1, 0.5)
  },

  setBattery () {
    this.batteryText.setText(`${this.batteries} 顆能量電池`)
  },

  initCountdown () {
    let style = {
      font: '24pt Arial',
      fill: '#fff',
    }
    let time = this.COUNTDOWN
    let timeText = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.1, this.toMinSec(time), style)
    timeText.anchor.setTo(0.5)
    this.game.time.events.loop(Phaser.Timer.SECOND, function() {
      time--
      timeText.setText(this.toMinSec(time))
      if(time === 0) {
        this.gameOver()
      }
    }, this)
  },

  initWaveNotice () {
    let style = {
      font: '20pt Arial',
      fill: '#fff',
    }
    this.waveNotice = this.game.add.text(this.game.world.width*0.5, this.game.world.height*0.2, `Wave ${this.currentLevel}`, style)
    this.waveNotice.anchor.setTo(0.5)
    this.waveNotice.kill()
  },

  showWaveNotice (level) {
    this.waveNotice.setText(`Wave ${this.currentLevel}`)
    this.waveNotice.revive()
    this.game.time.events.add(Phaser.Timer.SECOND, function() {
      this.waveNotice.kill()
    }, this)
  },

  toMinSec(time) {
    let min = Math.floor(time/60)
    min = (min >= 10 ? min : '0'+min)
    let sec = time%60
    sec = (sec >= 10 ? sec : '0'+sec)
    return `${min}:${sec}''`
  },

  // game Over
  gameOver () {
    this.game.state.start('gameover', true, false, this.batteries)
  },
}