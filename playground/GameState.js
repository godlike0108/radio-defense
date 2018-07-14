var SpaceShip = SpaceShip || {}

SpaceShip.GameState = {
  init () {

  },

  preload () {

  },

  create () {
    // draw an arc
    this.arc = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY)
    this.arc.beginFill(0x33EE33);
    this.arc.arc(0, 0, 120, this.game.math.degToRad(0), this.game.math.degToRad(270), false);
    this.arc.endFill();
  },

  update () {

  },
}