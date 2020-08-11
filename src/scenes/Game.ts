import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
    player!: Phaser.Physics.Arcade.Sprite
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys

	constructor()
	{
		super('game')
	}

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
        console.log('game start')

        const { width, height } = this.scale
        this.player = this.physics.add.sprite(width * .5, height * .5, 'base')
            .play('down-idle')
    }

    update()
    {
        const speed = 200
        
        if (this.cursors.up?.isDown) {
            this.player.setVelocity(0, -speed)
            this.player.play('up-walk', true)
        } else if (this.cursors.right?.isDown) {
            this.player.setVelocity(speed, 0)
            this.player.play('right-walk', true)
        } else if (this.cursors.down?.isDown) {
            this.player.setVelocity(0, speed)
            this.player.play('down-walk', true)
        } else if (this.cursors.left?.isDown) {
            this.player.setVelocity(-speed, 0)
            this.player.play('left-walk', true)
        } else {
            const direction = this.player.anims.currentAnim.key.split('-').shift()
            this.player.setVelocity(0, 0)
            this.player.play(`${direction}-idle`, true)
        }
    }
}
