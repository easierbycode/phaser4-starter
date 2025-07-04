import Phaser from "phaser";
import { WIDTH, HEIGHT } from './constants';
import { WeaponPlugin } from './weapons/weapon-plugin/index';

class GameScene extends Phaser.Scene {
  [x: string]: any
  preload() {
    // this.load.pack("pack", "assets/asset-pack.json"); // ← created in the IDE
  }
  create() {
    window.gameScene = this;
    // Initialize plugins
    if (!this.weapons) {
      this.plugins.installScenePlugin('WeaponPlugin', WeaponPlugin, 'weapons', this);
    }

    // Create game groups
    this.baddies = this.add.group();
    this.players = this.physics.add.group();

    this.setupGamepadListeners();
  }

  setupGamepadListeners() {
    const x = Number(this.game.config.width) / 2;
    const text = this.add.text(x, 300, "PLEASE CONNECT CONTROLLER TO CONTINUE", {
      fontFamily: "system-ui",
      fontSize: 32,
      color: "#ffffff"
    }).setOrigin(0.5);

    this.input.gamepad?.on('connected', (gamepad: Phaser.Input.Gamepad.Gamepad) => {
      // Create a new player for this gamepad
      const playerIndex = this.players.getLength();
      const offsetX = playerIndex % 2 === 0 ? -100 : 100;
      const offsetY = playerIndex < 2 ? -100 : 100;
      
      // const newPlayer = new Player(
      //   gamepad, 
      //   this, 
      //   (WIDTH / 2) + offsetX, 
      //   (HEIGHT / 2) + offsetY
      // );
      
      // this.players.add(newPlayer);
      
      // If this is the first player, start the game
      if (playerIndex === 0) {
        text.destroy();
        // this.player = newPlayer;
        this.startGame();
      }
    });
  }

  startGame() {}
}

new Phaser.Game({
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      debug: Number(new URL(window.location.href).searchParams.get('debug')) == 1,
      gravity: { x: 0, y: 0 }
    }
  },
  parent: "game",
  scene: [GameScene],
  input: {
    gamepad: true
  },
  render: {
    pixelArt: true
  },
  plugins: {
    scene: [
      { key: 'WeaponPlugin', plugin: WeaponPlugin, mapping: 'weapons' }
    ]
  },
  scale: {
    mode: Phaser.Scale.ENVELOP
  }
});
