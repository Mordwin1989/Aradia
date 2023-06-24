class SceneDeath extends Phaser.Scene {
    constructor() {
        super('SceneDeath');
    }
    preload() {
		//preload background
		this.load.image('outroKey', 'assets/OutroRespawn.png');
    }
	
    create() {
		//adding the background
        this.outroImage = this.add.image(0, 0, 'outroKey');
		//positions our image in the center
		this.outroImage.x = gameObj.config.width / 2;
		this.outroImage.y = gameObj.config.height / 2;
		//makes the image fit our screen sice
		this.outroImage.scale = 1.1;
		this.keyboard = this.input.keyboard.addKeys("R");
    }
	
    update() {
		if (this.keyboard.R.isDown) {
			//set playerhp to half
			playerObj.hp = playerObj.maxHp / 2;
			//cheifhouse coordinates
			playerObj.playerX = 2000; 
			playerObj.playerY = 2100; 
			currentBiome = "city";
            this.scene.start('SceneCity');
        }
	}
}









