export interface ICountdownController {
  start(callback: () => void, duration?: number): void
  update(): void
  stop(): void
}

export default class CountdownController implements ICountdownController {
  private scene: Phaser.Scene;
  private label: Phaser.GameObjects.Text

  private duration?: number
  private timerEvent?: Phaser.Time.TimerEvent

  constructor(scene: Phaser.Scene, label: Phaser.GameObjects.Text) 
  {
    this.scene = scene
    this.label = label
  }

  start(callback, duration = 45000)
  {
    this.stop()

    this.duration = duration

    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        this.stop()
        callback()
      }
    })
  }

  update()
  {
    if (!this.timerEvent || !this.duration || this.duration <= 0) {
      if (this.duration && this.duration <= 0) {
        this.label.text = '0'
      }
      return
    }

    const elapsed = this.timerEvent.getElapsed()
    const remaining = this.duration - elapsed
    const seconds = (remaining / 1000).toFixed(2)

    this.label.text = seconds
  }

  stop()
  {
     if (this.timerEvent) {
       this.timerEvent.destroy()
       this.timerEvent = undefined
     }
  }
}