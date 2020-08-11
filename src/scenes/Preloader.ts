import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene 
{
  constructor() 
  {
    super('preloader');
  }

  preload() 
  {
    this.load.spritesheet('base', 'textures/base-tilesheet.png', { frameWidth: 64 })
  }

  create()
  {
    this.anims.create({
      key: 'up-idle',
      frames: [{ key: 'base', frame: 55 }],
    })
    this.anims.create({
      key: 'right-idle',
      frames: [{ key: 'base', frame: 78 }],
    })
    this.anims.create({
      key: 'down-idle',
      frames: [{ key: 'base', frame: 52 }],
    })
    this.anims.create({
      key: 'left-idle',
      frames: [{ key: 'base', frame: 81 }],
    })

    this.anims.create({
      key: 'up-walk',
      frames: this.anims.generateFrameNumbers('base', {
        start: 55,
        end: 57,
      }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'right-walk',
      frames: this.anims.generateFrameNumbers('base', {
        start: 78,
        end: 80,
      }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'down-walk',
      frames: this.anims.generateFrameNumbers('base', {
        start: 52,
        end: 54,
      }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'left-walk',
      frames: this.anims.generateFrameNumbers('base', {
        start: 81,
        end: 83,
      }),
      frameRate: 8,
      repeat: -1
    })

    this.scene.start('game')
  }
}
