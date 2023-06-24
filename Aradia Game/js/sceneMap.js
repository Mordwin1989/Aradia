class SceneMap extends Phaser.Scene {
    constructor() {
        super('SceneMap');
    }
    preload() {
		//load image
		this.load.image('mapKey', 'assets/aradiaMap.png');
    }
    create() {
		//add image
		this.mapImage = this.add.image(0, 0, 'mapKey');
		//adjust image
		this.mapImage.x = gameObj.config.width/2;
		this.mapImage.y = gameObj.config.height/2;
		//add keyboard key
		this.keyboard = this.input.keyboard.addKeys("M");
		
		
		this.currentMapObj;
        this.rectangleSizeX;
        this.rectangleSizeY;
        this.rectangleDistanceX;
        this.rectangleDistanceY;
        switch (currentBiome) {
            case "nature" :
            // 250-400
            // 550-597
                this.currentMapObj = this.make.tilemap({ key: 'tilemapKeyN' });
                this.rectangleSizeX = 300;
                this.rectangleDistanceX = 250;
                this.rectangleSizeY = 197;
                this.rectangleDistanceY = 400;
                break;
            case "ice" : 
            //55-182
            //248-378
                this.currentMapObj = this.make.tilemap({ key: 'tilemapKeyI' });
                this.rectangleSizeX = 193;
                this.rectangleDistanceX = 55;
                this.rectangleSizeY = 196;
                this.rectangleDistanceY = 182;
                break;
            case "fire" : 
            //311-183
            //507-377
                this.currentMapObj = this.make.tilemap({ key: 'tilemapKeyF' });
                this.rectangleSizeX = 196;
                this.rectangleDistanceX = 311;
                this.rectangleSizeY = 194;
                this.rectangleDistanceY = 183;
                break;
            case "desert" : 
            //560-182
            //755-377
                this.currentMapObj = this.make.tilemap({ key: 'tilemapKeyD' });
                this.rectangleSizeX = 195;
                this.rectangleDistanceX = 560;
                this.rectangleSizeY = 195;
                this.rectangleDistanceY = 183;
                break;
            case "city" :
            //362-483
            //440-560
                this.currentMapObj = this.make.tilemap({ key: 'tilemapKeyC' });
                this.rectangleSizeX = 78;
                this.rectangleDistanceX = 362;
                this.rectangleSizeY = 77;
                this.rectangleDistanceY = 483;
                break;
        }
		
		//create sprite or draw circle
		this.graphics = this.add.graphics();
		this.graphics.lineStyle(3, 0x000000, 1);
		this.graphics.fillStyle(0x8946CF, 1);
		this.circle = new Phaser.Geom.Point(
		playerObj.playerX / this.currentMapObj.widthInPixels * this.rectangleSizeX + this.rectangleDistanceX,
        playerObj.playerY / this.currentMapObj.heightInPixels * this.rectangleSizeY + this.rectangleDistanceY);
		var radius = 15;
		this.graphics.fillCircle(this.circle.x, this.circle.y, radius);
		this.graphics.strokeCircle(this.circle.x, this.circle.y, radius);

		console.log(this.circle)
		console.log(playerObj.playerX / this.currentMapObj.widthInPixels * this.rectangleSizeX + this.rectangleDistanceX)
		console.log( playerObj.playerY / this.currentMapObj.heightInPixels * this.rectangleSizeY + this.rectangleDistanceY)
		
		
		//coordinate text
        this.coordinateText = this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#ffffff' }).setScrollFactor(0);
    }

	
    update() {
		//set coordinate texts
		    this.coordinateText.setText([
                'screen x: ' + this.input.x,
                'screen y: ' + this.input.y,
                'world x: ' + this.input.mousePointer.worldX,
                'world y: ' + this.input.mousePointer.worldY
		    ]);
			
        //scene change
		//if keyboard key M is held down the switch statement starts the scene you came from
		if (this.keyboard.M.isDown) {
			switch (currentBiome) {
				case "nature" :
					this.scene.start("SceneNature");
					break;
				case "ice" : 
					this.scene.start("SceneIce");
					break;
				case "fire" : 
					this.scene.start("SceneFire");
					break;
				case "desert" : 
					this.scene.start("SceneDesert");
					break;
				case "death" :
					this.scene.start("SceneDeath");
					break;
				case "city" :
					this.scene.start("SceneCity");
					break;
			}
        }  
		
		
	}
}