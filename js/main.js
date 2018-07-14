var SpaceShip = SpaceShip || {}

SpaceShip.game = new Phaser.Game(640, 480, Phaser.AUTO)

SpaceShip.game.state.add('GameState', SpaceShip.GameState)
SpaceShip.game.state.start('GameState')