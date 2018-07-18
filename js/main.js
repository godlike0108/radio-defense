var SpaceShip = SpaceShip || {}

SpaceShip.game = new Phaser.Game(800, 600, Phaser.AUTO)

SpaceShip.game.state.add('start', SpaceShip.StartState)
SpaceShip.game.state.add('play', SpaceShip.PlayState)
SpaceShip.game.state.add('gameover', SpaceShip.GameoverState)

SpaceShip.game.state.start('gameover')