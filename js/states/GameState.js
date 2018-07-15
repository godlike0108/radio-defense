var SpaceShip = SpaceShip || {}

SpaceShip.GameState = {
  init () {
    
  },

  preload () {
    this.playerCoreTexture = SpaceShip.PlayerCoreTexture()
    this.playerTexture = SpaceShip.PlayerTexture()
    this.playerShieldTexture = SpaceShip.PlayerShieldTexture()
    this.playerGunTexture = SpaceShip.PlayerGunTexture()
  },

  create () {
    // create player core
    this.playerCore = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.playerCoreTexture)
    this.playerCore.anchor.setTo(0.5)
    // create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.playerTexture)
    this.player.anchor.setTo(0.5)
    // create player shield
    this.playerShield = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 90, this.playerShieldTexture)
    this.playerShield.anchor.setTo(0.5)
    // create player gun
    this.playerGun = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 90, this.playerGunTexture)
    this.playerGun.anchor.setTo(0.5)
    this.playerGun.scale.setTo(0.8)

  },

  update () {

  },
}