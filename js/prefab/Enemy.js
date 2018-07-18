var SpaceShip = SpaceShip || {}

SpaceShip.Enemy = class Enemy extends Phaser.Sprite {
  constructor (game, x, y, speed, target, itemBoxes) {
    super(game, x, y)
    this.anchor.setTo(0.5)
    this.speed = speed
    this.target = target
    this.itemBoxes = itemBoxes
    this.ITEM_SPEED = 20
    this.DROP_CHANCE = 0.2
  }

  reset (x, y) {
    super.reset(x, y)
  }

  update () {
    this.game.physics.arcade.moveToObject(this, this.target, this.speed)
  }

  damage(amount) {
    super.damage(amount)
    if(this.health <= 0 && this.game.rnd.frac() <= this.DROP_CHANCE) {
      this.dropItemBox()
    }

    if(this.health <= 0) {
      this.game.state.states.play.batteries++
      this.game.state.states.play.setBattery()
      this.game.state.states.play.allOutCheck()
    }
  }

  dropItemBox () {
    let itemBox = this.itemBoxes.getFirstExists(false)
    let itemBoxType = ['itemDouble', 'itemShield', 'itemLaser', 'itemHeart', 'itemUlt']
    let rnd = this.game.rnd.between(0, itemBoxType.length)
    if(!itemBox) {
      itemBox = new SpaceShip.ItemBox(this.game, this.x, this.y, itemBoxType[rnd])
      this.itemBoxes.add(itemBox)
    } else {
      itemBox.reset(this.x, this.y, itemBoxType[rnd])
    }

    itemBox.body.velocity.x = this.game.rnd.between(-this.ITEM_SPEED, this.ITEM_SPEED)
    itemBox.body.velocity.y = this.game.rnd.between(-this.ITEM_SPEED, this.ITEM_SPEED)
  }
}