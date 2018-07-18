var SpaceShip = SpaceShip || {}

SpaceShip.StartState = {
  init () {
    this.wWidth = this.game.world.width
    this.wHeight = this.game.world.height
    this.textStyle = {
      font: '100 20px Helvetica',
      fill: '#FFF',
    }

    this.circleData = [
      {x: this.wWidth*0.5, y: this.wHeight*0.5, r: 350, style: [2, 0xFFFFFF, 1]},
      {x: this.wWidth*0.5, y: this.wHeight*0.5, r: 500, style: [2, 0xFFFFFF, 0.5]}
    ]

    // button texture
    this.buttonTexture = () => {
      let graph = this.game.add.graphics()
      graph.lineStyle(3, 0xFFFFFF, 1)
      graph.drawRoundedRect(0, 0, 160, 40, 20)
      let texture = graph.generateTexture()
      graph.destroy()
      return texture
    }
  },

  preload () {
    this.load.image('logo', 'assets/logo.png')
  },

  create () {

    // add graphics
    this.cover = this.game.add.graphics()
    this.circleData.forEach(circle => {
      this.cover.lineStyle(...circle.style)
      this.cover.drawCircle(circle.x, circle.y, circle.r)
    })

    // add logo
    this.logo = this.game.add.sprite(this.wWidth*0.5, this.wHeight*0.42, 'logo')
    this.logo.anchor.setTo(0.5)
    this.logo.scale.setTo(0.6)

    // add start button
    this.button = this.game.add.sprite(this.wWidth*0.5, this.wHeight*0.6, this.buttonTexture())
    this.button.anchor.setTo(0.5)
    this.button.inputEnabled = true
    this.button.events.onInputDown.add(this.startGame, this)

    this.buttonText = this.game.add.text(this.button.x, this.button.y+2, 'Start Game', this.textStyle)
    this.buttonText.anchor.setTo(0.5)
  },

  startGame () {
    this.game.state.start('play')
  }
}