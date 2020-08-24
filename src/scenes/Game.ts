import Phaser from 'phaser'
import PhaserJuice from '../lib/juice'

import CountdownController, { ICountdownController } from '../controllers/CountdownController'

const level = [
    [1, 4, 0],
    [2, 2, 3],
    [3, 1, 4],
]

const LABEL_FONT = 'might-makes-right-bb'

export default class Game extends Phaser.Scene
{
    player!: Phaser.Physics.Arcade.Sprite
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    boxGroup!: Phaser.Physics.Arcade.StaticGroup
    itemGroup!: Phaser.GameObjects.Group
    totalMatches!: number
    
    activeBox?: Phaser.Physics.Arcade.Sprite
    countdown?: ICountdownController
    
    selectedBoxes: { box: Phaser.Physics.Arcade.Sprite, item: Phaser.GameObjects.Sprite }[] = []
    matchesCount: number = 0
    juice: PhaserJuice
    
	constructor()
	{
        super('game')
        
        this.juice = new PhaserJuice(this)

        const rowCount = level.length
        const colCount = level[0].length
        this.totalMatches = ((rowCount * colCount) - 1) / 2
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

        this.player.setCollideWorldBounds(true, 5, 50)
        
        this.createBoxes()
        this.itemGroup = this.physics.add.staticGroup();

        const timerLabel = this.add.text(width * .5, 50, '45', {
            fontFamily: LABEL_FONT,
            fontSize: 48,
        }).setOrigin(0.5)

        this.countdown = new CountdownController(this, timerLabel)
        this.countdown.start(this.handleCountdownComplete.bind(this));

        this.physics.add.collider(this.player, this.boxGroup, this.handlePlayerBoxCollide, undefined, this)
    }

    update()
    {
        this.countdown?.update()
        this.handlePlayerMovement()

        this.children.each(item => {
            const child = item as Phaser.Physics.Arcade.Sprite

            if (!child.getData('sorted')) {
                child.setDepth(child.y)
            }
        })
        

        this.updateActiveBox()
    }

    setGameStatusLabel(string: string)
    {
        const { width, height } = this.scale

        this.add.text(width * .5, height * .5, string, {
            fontFamily: LABEL_FONT,
            fontSize: 48,
        }).setOrigin(0.5)
    }

    handleCountdownComplete()
    {
        this.player.active = false

        this.setGameStatusLabel('You lose')
    }

    handlePlayerMovement() {
        if (!this.player.active) {
            this.player.setVelocity(0, 0)
            return
        }

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
                const box = this.boxGroup.get(xPos, yPos, 'boxes', 5) as Phaser.Physics.Arcade.Sprite

                box.setSize(64, 57)
                    .setOffset(0, 7)
                    .setData('itemType', level[row][col])
            }
        }
    }

    handlePlayerBoxCollide(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        const box = obj2 as Phaser.Physics.Arcade.Sprite

        if (this.activeBox || box.getData('opened')) {
            return
        }
 
        this.activeBox = box
        this.activeBox.setFrame(0)
    }

    openBox(box: Phaser.Physics.Arcade.Sprite)
    {
        const itemType = box.getData('itemType')
        const itemPosY = box.y - 10
        
        let item!: Phaser.GameObjects.Sprite

        switch(itemType) {
            case 0:
                item = this.itemGroup.get(box.x, itemPosY)
                item.setTexture('gorilla')
                break;
            case 1:
                item = this.itemGroup.get(box.x, itemPosY)
                item.setTexture('chick')
                break;
            case 2:
                item = this.itemGroup.get(box.x, itemPosY)
                item.setTexture('parrot')
                break;
            case 3:
                item = this.itemGroup.get(box.x, itemPosY - 5)
                item.setTexture('chicken')
                break;
            case 4:
                item = this.itemGroup.get(box.x, itemPosY)
                item.setTexture('duck')
                break;
        }

        if (!item) {
            return
        }

        box.setData('opened', true)

        item.setData('sorted', true)
        item.setDepth(2000)

        item.setDisplaySize(64, 64)

        item.scaleX = 0.9
        item.scaleY = 0
        item.alpha = 0

        this.selectedBoxes.push({ box, item })

        box.setFrame(4)


        if (itemType === 0) {
            this.handleBearSelected();
        }

        this.tweens.add({
            targets: item,
            y: '-=50',
            alpha: 1,
            scaleY: 0.9,
            duration: 250,
            onComplete: () => {
                if (this.selectedBoxes.length < 2) {
                    return
                }

                this.checkForMatch()
            }
        })

        this.activeBox = undefined
    }

    animateItemsDown(targets, callback: () => void = () => {}, delay: number = 0) {
        this.tweens.add({
            targets: targets,
            y: '+=50',
            alpha: 0,
            scaleY: 0,
            duration: 300,
            delay,
            onComplete: callback
        })
    }

    handleBearSelected()
    {
        const found = this.selectedBoxes.pop()

        found!.item.setTint(0xf19385)
        found!.box.setFrame(6)
        
        this.player.active = false
        this.juice.shake(this.player)

        this.time.delayedCall(1000, () => {
            found!.item.setTint(0xffffff)
            found!.box.setFrame(5)
            found!.box.setData('opened', false)

            
            if (this.selectedBoxes.length > 0) {
                const first = this.selectedBoxes.pop()
                this.animateItemsDown(first?.item)

                first?.box
                    .setData('opened', false)
                    .setFrame(5)
            }

            this.animateItemsDown(found!.item, () => {
                this.player.active = true
            })
        })
    }

    checkForMatch()
    {
        const second = this.selectedBoxes.pop()
        const first = this.selectedBoxes.pop()

        if (first!.item.texture !== second!.item.texture) {
            this.animateItemsDown([ first!.item, second!.item ], () => {
                first!.box
                    .setData('opened', false)
                    .setFrame(5)

                second!.box
                    .setData('opened', false)
                    .setFrame(5)
            }, 600)
            return
        }

        ++this.matchesCount
        this.time.delayedCall(600, () => {
            first!.box.setFrame(0)
            second!.box.setFrame(0)

            first!.box.play('box-down')
            second!.box.play('box-down')
    
            first!.item.destroy()
            second!.item.destroy()

            console.log(this.matchesCount, this.totalMatches);

            if (this.matchesCount === this.totalMatches) {
                this.countdown?.stop()

                this.player.active = false

                this.setGameStatusLabel('You win!')
            }
        })
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
        
        this.activeBox.setFrame(5)
        this.activeBox = undefined
    }
}
