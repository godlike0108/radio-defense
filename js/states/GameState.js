var SpaceShip = SpaceShip || {}

SpaceShip.GameState = {
  init () {
    this.CENTER = new Phaser.Point(this.game.world.centerX, this.game.world.centerY)
    // player settings
    this.ANG_VEL = 1
    this.ANG_TOL = this.game.math.degToRad(6) // 在此角度區間為靜止
    this.GUN_DIS = 90
    this.SHIELD_DIS = 90
    this.BULLET_SPEED = 500
    this.SHOOT_SPEED = Phaser.Timer.SECOND/5*2

    // enemy settings
    // enemy player distance
    this.ENEMY_DIS = this.CENTER.distance(new Phaser.Point(0, 0))
    this.ENEMY_SPEED = 10

    // start physic engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload () {
    this.playerCoreTexture = SpaceShip.PlayerCoreTexture()
    this.playerTexture = SpaceShip.PlayerTexture()
    this.playerShieldTexture = SpaceShip.PlayerShieldTexture()
    this.playerGunTexture = SpaceShip.PlayerGunTexture()
    this.playerBulletTexture = SpaceShip.PlayerBulletTexture()
    // enemy UFO
    this.UFOTexture = SpaceShip.UFOTexture()

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
    this.createEnemy(this.UFOTexture, 10)
    // this.enemy = this.game.add.sprite(300, 300, this.UFOTexture)
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
  },

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
    this.enemies = this.add.group()
    this.enemies.enableBody = true
  },

  createEnemy (texture, health) {
    let enemy = this.enemies.getFirstExists(false)

    // 隨機決定位置
    let angle = this.game.rnd.angle()
    let position = new Phaser.Point(this.playerCore.x + 200, this.playerCore.y).rotate(this.playerCore.x, this.playerCore.y, angle, true)
    if(!enemy) {
      enemy = new SpaceShip.Enemy(this.game, position.x, position.y, texture, health, this.ENEMY_SPEED, this.playerCore)
      this.enemies.add(enemy)
    }
    enemy.reset(position.x, position.y, health, texture)
  },


}