class SceneIntro extends Phaser.Scene {
    constructor(){
        super('SceneIntro');
    }
    preload(){
        this.load.image('introKey', 'assets/Intro.png');
		//load player sheet
		this.load.spritesheet('playerKey', 'assets/george2.png', {frameWidth: 29, frameHeight: 32}); 
		//load the enemy spritesheet
        this.load.spritesheet('spiderNKey', 'assets/spider01.png', {frameWidth: 64, frameHeight: 64});
		this.load.spritesheet('spiderDKey', 'assets/spider04.png', {frameWidth: 64, frameHeight: 64}); 
		this.load.spritesheet('spiderIKey', 'assets/spider02.png', {frameWidth: 64, frameHeight: 64}); 
		this.load.spritesheet('spiderFKey', 'assets/spider03.png', {frameWidth: 64, frameHeight: 64});
    }
    create(){
        this.introImage = this.add.image(0, 0, "introKey");
        //positions our image in the center
        this.introImage.x = gameObj.config.width/2;
        this.introImage.y = gameObj.config.height/2;
        //makes the image fit our screen sice
        this.introImage.scale = 1.1;
        //add keyboard button T
        this.keyboard = this.input.keyboard.addKeys("T");
		
		//player animation
			this.anims.create({
                key: 'walkingDown',
                frames: this.anims.generateFrameNames('playerKey', {
                    frames: [0, 4, 8, 12]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
            });
            this.anims.create({
                key: 'walkingUp',
                frames: this.anims.generateFrameNames('playerKey', {
                    frames: [2, 6, 10, 14]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
            });
            this.anims.create({
                key: 'walkingLeft',
                frames: this.anims.generateFrameNames('playerKey', {
                    frames: [1, 5, 9, 13]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
            });
            this.anims.create({
                key: 'walkingRight',
                frames: this.anims.generateFrameNames('playerKey', {
                    frames: [3, 7, 11, 15]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
            });
    }
    update(){
        //use keyboard button T to transition into SceneMain
			// cheifhouse coordinates
         if (this.keyboard.T.isDown) {
			playerObj.playerX = 2000; 
			playerObj.playerY = 2100; 
			currentBiome = "city";
            this.scene.start('SceneCity');
        } 
		
		/* if (this.keyboard.T.isDown) {
			playerObj.playerX = 1040; 
			playerObj.playerY = 400;
			currentBiome = "nature";
            this.scene.start('SceneNature');
		} */
		
		/*if (this.keyboard.T.isDown) {
			//cheifhouse coordinates
			playerObj.playerX = 2220; 
			playerObj.playerY = 2520; 
            this.scene.start('SceneDesert');
        }*/
		/*if (this.keyboard.R.isDown) {
			//start the death scene
            this.scene.start('SceneDeath');
        }*/
    }
	
	

}