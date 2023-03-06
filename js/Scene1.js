class Scene1 extends Phaser.Scene{
	constructor(){
		super("bootGame");
	}
	
	preload(){

		this.load.image("background", "assets/images/background.png");
		this.load.spritesheet('button', 'assets/buttons/button_start.png', {
			frameWidth: 50,
			frameHeight: 20
		});

		this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
			frameWidth: 16,
			frameHeight: 16
		});

		this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
			frameWidth: 32,
			frameHeight: 16
		});

		this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
			frameWidth: 32,
			frameHeight: 32
		});

		this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
			frameWidth: 16,
			frameHeight: 16
		});
	
		this.load.spritesheet("player", "assets/spritesheets/player.png", {
			frameWidth: 16,
			frameHeight: 24
		});

		this.load.spritesheet("beam", "assets/spritesheets/beam.png", {
			frameWidth: 16,
			frameHeight: 16
		});
		
		this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

		this.load.audio("audio_beam", ["assets/sounds/beam.ogg", "assets/sounds/beam.mp3"]);
		this.load.audio("audio_explosion", ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
		this.load.audio("audio_pickup", ["assets/sounds/pickup.ogg", "assets/sounds/pickup.mp3"]);
		this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platformer12.mp3"]);
	}
	
	create(){
		this.add.text(20, 20, "Press to start the game");
		this.button = this.add.sprite(130, 150, 'button');
		this.button.setInteractive();
		this.input.on('gameobjectdown', this.actionOnClick, this);
	}

	actionOnClick() {
		this.scene.start("playGame");
	}
}