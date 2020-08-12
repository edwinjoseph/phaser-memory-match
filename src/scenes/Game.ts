import Phaser from 'phaser'

const level = [
    [1, 4, 0],
    [2, 2, 3],
    [3, 1, 4],
]

export default class Game extends Phaser.Scene
{
    player!: Phaser.Physics.Arcade.Sprite
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    boxGroup!: Phaser.Physics.Arcade.StaticGroup
    activeBox!: Phaser.Physics.Arcade.Sprite | undefined

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

        this.physics.add.collider(this.player, this.boxGroup, this.handlePlayerBoxCollide, undefined, this)
    }

    update()
    {
        this.handlePlayerMovement()

        this.children.each(item => {
            const child = item as Phaser.Physics.Arcade.Sprite
            child.setDepth(child.y)
        })

        this.updateActiveBox()
    }

    handlePlayerMovement() {
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

        const spacePressed = Phaser.Input.Keyboard.JustUp(this.cursors.space!)

        if (spacePressed && this.activeBox) {
            this.openBox(this.activeBox)
        }
    }

    createBoxes()
    {
        this.boxGroup = this.physics.add.staticGroup();

        const { width, height } = this.scale;
        
        let x = .25
        let y = .25

        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                const xPos = width * (x * (col + 1))
                const yPos = height * (y * (row + 1))
                const box = this.boxGroup.get(xPos, yPos, 'base', 19) as Phaser.Physics.Arcade.Sprite

                box.setSize(64, 32)
                    .setOffset(0, 32)
                    .setData('itemType', level[row][col])
            }
        }
    }

    handlePlayerBoxCollide(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        const player = obj1 as Phaser.Physics.Arcade.Sprite
        const box = obj2 as Phaser.Physics.Arcade.Sprite

        if (this.activeBox) {
            return
        }

        this.activeBox = box
        this.activeBox.setFrame(6)
    }

    openBox(box: Phaser.Physics.Arcade.Sprite)
    {
        const itemType = box.getData('itemType')
        console.log(itemType)
    }

    updateActiveBox() 
    {
        if (!this.activeBox) {
            return
        }

        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.activeBox.x, this.activeBox.y,
        )

        if (distance < 64) {
            return
        }
        
        this.activeBox.setFrame(19)
        this.activeBox = undefined
    }
}
