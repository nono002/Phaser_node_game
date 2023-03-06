class Scene2 extends Phaser.Scene{
	constructor(){
		super("playGame");
	}
	
	create(){
		this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
		this.background.setOrigin(0, 0);
		
		this.ship1 = this.add.sprite(config.width/2-50, 0, "ship");
		this.ship2 = this.add.sprite(config.width/2, 0, "ship2");
		this.ship3 = this.add.sprite(config.width/2+50, 0, "ship3");
		
		this.ship1.name = "111";
		this.ship2.name = "222";
		this.ship3.name = "333";
		
		this.enemies = this.physics.add.group();
		this.enemies.add(this.ship1);
		this.enemies.add(this.ship2);
		this.enemies.add(this.ship3);
		
		this.player = this.physics.add.sprite(config.width/2-8, config.height-64, "player");
		
		this.anims.create({
			key: "ship1_anim",
			frames: this.anims.generateFrameNumbers("ship"),
			frameRate: 20,
			repeat: -1
		});
		
		this.anims.create({
			key: "ship2_anim",
			frames: this.anims.generateFrameNumbers("ship2"),
			frameRate: 20,
			repeat: -1
		});

		this.anims.create({
			key: "ship3_anim",
			frames: this.anims.generateFrameNumbers("ship3"),
			frameRate: 20,
			repeat: -1
		});

		this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion"),
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true
		});

		this.anims.create({
			key: "thrust",
			frames: this.anims.generateFrameNumbers("player"),
			frameRate: 20,
			repeat: -1
		});

		this.anims.create({
			key: "beam_anim",
			frames: this.anims.generateFrameNumbers("beam"),
			frameRate: 20,
			repeat: -1
		});

		this.ship1.play("ship1_anim");
		this.ship2.play("ship2_anim");
		this.ship3.play("ship3_anim");
		this.player.play("thrust");
		
		this.ship1.setInteractive();
		this.ship2.setInteractive();
		this.ship3.setInteractive();
		
		//this.input.on('gameobjectdown', this.destroyShip, this);
		
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.player.setCollideWorldBounds(true);
		
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.projectiles = this.add.group();
		
		this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
		this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
		
		/*this.ship1.setScale(1.0);
		this.ship2.setScale(1.0);
		this.ship3.setScale(1.0);
		
		this.ship1.flipY = true;
		this.ship2.flipY = true;
		this.ship3.flipY = true;*/
		
		//this.add.text(20, 20, "Playing game...", {
		//	font: "25px Arial", 
		//	fill: "yellow"
		//});
		
		this.score = 0;
		this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + this.score, 16);

		this.lifes = 3;
		this.lifesLabel = this.add.bitmapText(220, 5, "pixelFont", "+++️", 16);
		
		this.beamSound = this.sound.add("audio_beam");
		this.explosionSound = this.sound.add("audio_explosion");
		this.pickupSound = this.sound.add("audio_pickup");
		
		this.music = this.sound.add("music");
		var musicConfig = {
			mute: false,
			volume: 1,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: false,
			delay: 0
		}
		this.music.play(musicConfig);
		
	}
	
	update(){

		this.moveShip(this.ship1, 1);
		this.moveShip(this.ship2, 2);
		this.moveShip(this.ship3, 3);
		
		this.background.tilePositionY -= 0.5;
		
		this.movePlayerManager();
		
		if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
			//console.log("it's fire...");
			if(this.player.active){
				this.shootBeam();
			}
		}
		for(var i = 0; i < this.projectiles.getChildren().lenght; i++){
			var beam = this.projectiles.getChildren()[i];
			beam.update();
		}
	}
	
	moveShip(ship, speed){
		ship.y += speed;
		if(ship.y > config.height){
			this.resetShipPosition(ship);
		}
	}
	
	resetShipPosition(ship){
		ship.y = 0;
		var randomX = Phaser.Math.Between(16, config.width-16);
		ship.x = randomX;
	}
	
	destroyShip(pointer, gameObject){
		gameObject.setTexture("explosion");
		gameObject.play("explode");
	}
	
	movePlayerManager(){
		if(this.cursorKeys.left.isDown){
			this.player.setVelocityX(-gameSettings.playerSpeed);
		}else if(this.cursorKeys.right.isDown){
			this.player.setVelocityX(gameSettings.playerSpeed);
		}else{
			this.player.setVelocityX(0);
		}

		if(this.cursorKeys.up.isDown){
			this.player.setVelocityY(-gameSettings.playerSpeed);
		}else if(this.cursorKeys.down.isDown){
			this.player.setVelocityY(gameSettings.playerSpeed);
		}else{
			this.player.setVelocityY(0);
		}

	}
	
	shootBeam(){
		var beam = new Beam(this);
		this.beamSound.play();
	}
	
	hurtPlayer(player, enemy){
		var enemyExplosion = new Explosion(this, enemy.x, enemy.y);
		this.resetShipPosition(enemy);

		player.disableBody(true, true);
		
		this.time.addEvent({
			delay: 1000,
			callback: this.resetPlayer,
			callbackScope: this,
			loop: false
		});
		
		this.lifes -= 1;
		if(this.lifes == 0){
			this.gameOver = this.add.bitmapText(30, 100, "pixelFont", "GAME OVER", 53);

			this.button = this.add.sprite(130, 150, 'button');
			this.button.setInteractive();
			this.input.on('gameobjectdown', this.actionOnClick, this);

			//this.scene.pause(10000);
			//this.sprite.body.moves = false;
			//this.scene.stop();
			//this.scene.start("bootGame");
		}
		switch(this.lifes){
			case 3:
				this.lifesLabel.text = "+++";
				break;
			case 2:
				this.lifesLabel.text = " ++";
				break;
			case 1:
				this.lifesLabel.text = "  +";
				break;
			default:
				this.lifesLabel.text = "";
		}

	}

	hitEnemy(projectile, enemy){
		//console.log(enemy);
		var explosion = new Explosion(this, enemy.x, enemy.y);
		projectile.destroy();
		this.resetShipPosition(enemy);
		
		switch(enemy.name){
			case "333":
				this.score += 3;
				break;
			case "222":
				this.score += 2;
				break;
			default:
				this.score ++;
		}
		this.scoreLabel.text = "SCORE " + this.score;
		this.explosionSound.play();
	}

	resetPlayer(){
		var x = config.width / 2 - 8;
		var y = config.height - 64;
		this.player.enableBody(true, x, y, true, true);
		this.player.alpha = 0.5;
		var tween = this.tweens.add({
			targets: this.player,
			y: config.height - 64,
			ease: 'Power1',
			duration: 1500,
			repeat: 0,
			onComplete: function(){
				this.player.alpha = 1;
			},
			callbackScope: this
		});
	}
	
	actionOnClick() {
		this.scene.start("playGame");
	}

}