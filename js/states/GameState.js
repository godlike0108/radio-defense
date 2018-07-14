var SpaceShip = SpaceShip || {}

SpaceShip.GameState = {
  init () {
    
  },

  preload () {
    this.playerCoreTexture = SpaceShip.PlayerCoreTexture()
    this.playerTexture = SpaceShip.PlayerTexture()
  },

  create () {
    // create player core
    this.playerCore = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.playerCoreTexture)
    this.playerCore.anchor.setTo(0.5)
    // create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.playerTexture)
    this.player.anchor.setTo(0.5)

  },

  update () {

  },
}