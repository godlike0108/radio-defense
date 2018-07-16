var SpaceShip = SpaceShip || {}

SpaceShip.Meteorite = class Meteorite extends SpaceShip.Enemy {
  constructor (game, x, y, speed, target, group) {
    super(game, x, y, speed, target)
    this.health = 1
    this.loadTexture(SpaceShip.MeteoriteTexture(game))

    this.BROKE_DIS_MIN = 60
    this.BROKE_DIS_MAX = 80
    this.BROKE_ANG_MIN = 70
    this.BROKE_ANG_MAX = 110

    this.fractures = group
  }

  separate () {
    for(let i = 0; i < 2; i++) {
      let fracture = this.fractures.getFirstExists(false)

      if(!fracture) {
        fracture = new SpaceShip.SmallMeteorite(this.game, this.x, this.y, this.speed, this.target)
        this.fractures.add(fracture)
      } else {
        fracture.reset(this.x, this.y)
      }

      let rndDis = this.game.rnd.between(this.BROKE_DIS_MIN, this.BROKE_DIS_MAX)
      let rndAng = this.game.rnd.sign() * this.game.rnd.between(this.BROKE_ANG_MIN, this.BROKE_ANG_MAX)
      let newPos = new Phaser.Point(this.x+rndDis, this.y).rotate(this.x, this.y, this.position.angle(this.target, true) + rndAng, true)
      this.game.add.tween(fracture).to({x: newPos.x, y: newPos.y}, 800, null, true)
    }
  }

  damage (amount) {
    super.damage(amount)

    if(this.health <= 0) {
      this.separate()
    }
  }

  update () {
    super.update()
  }
}