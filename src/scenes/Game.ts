import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
    player!: Phaser.Physics.Arcade.Sprite
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    boxGroup!: Phaser.Physics.Arcade.StaticGroup

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
        this.player = this.physics.add.sprite(width * .5, (height * .5) - 74, 'base')
            .setSize(40, 16)
            .setOffset(12, 40)
            .play('down-idle')

        this.createBoxes()

        this.physics.add.collider(this.player, this.boxGroup)
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

        this.children.each(item => {
            const child = item as Phaser.Physics.Arcade.Sprite
            child.setDepth(child.y)
        })
    }

    createBoxes()
    {
        this.boxGroup = this.physics.add.staticGroup();

        const { width, height } = this.scale;
        
        let x = .25
        let y = .25

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const xPos = x * (row + 1)
                const yPos = y * (col + 1)
                this.boxGroup.get(width * xPos, height * yPos, 'base', 19)
                    .setSize(64, 32)
                    .setOffset(0, 32)
            }
        }
    }
}
