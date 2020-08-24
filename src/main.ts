import Phaser from 'phaser'
import WebfontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin';

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 700,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	plugins: {
		global: [{
			key: 'rexWebfontLoader',
			plugin: WebfontLoaderPlugin,
			start: true
		}]
	},
	scene: [Preloader, Game],
}

export default new Phaser.Game(config)
