class SceneDesert extends Phaser.Scene {
    constructor() {
        super('SceneDesert');
    }
    preload() {
			//adding json tilemap
			this.load.tilemapTiledJSON('tilemapKeyD', 'assets/DesertMap.json');
			//adding tileset images
			this.load.image('tilesetKeyD', 'assets/1.png');
            this.load.image('tilesetKeyD2', 'assets/ground_tiles.png');
    }
    create() {
			//using the json preload
			var mapObjDesert = this.make.tilemap({ key: 'tilemapKeyD' });
			//using the tileset preload
			var tilesetObj = mapObjDesert.addTilesetImage('1', 'tilesetKeyD');
			var tileset2Obj = mapObjDesert.addTilesetImage('ground_tiles', 'tilesetKeyD2');
            //setting up layers
            var GroundLayer = mapObjDesert.createStaticLayer('GroundLayer', tileset2Obj, 0, 0);
            var RoadLayer = mapObjDesert.createStaticLayer('RoadLayer', tileset2Obj, 0, 0);
            var QuickSand = mapObjDesert.createStaticLayer('QuickSand', tilesetObj, 0, 0);
            var GroundCollisionLayer = mapObjDesert.createStaticLayer('GroundCollisionLayer', tileset2Obj, 0, 0);
            var WaterCollisionLayer = mapObjDesert.createStaticLayer('WaterCollisionLayer', tilesetObj, 0, 0);
			//adding the enemy 
            this.spiderD = this.physics.add.sprite(2030, 2000, 'spiderDKey');
			//scaling up the size of the enemy
			this.spiderD.scale = 1.2;
			//adding the player
            this.player = this.physics.add.sprite(playerObj.playerX, playerObj.playerY, 'playerKey');
			
			//make ui
			this.uiTextG = this.add.text(gameObj.config.width - 215, 10, 'Player Gold: ' + playerObj.gold,{ font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
			this.uiTextHp = this.add.text(gameObj.config.width - 215, 30, 'Player Hp:   ' + playerObj.hp,{ font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
			this.uiTextAtk = this.add.text(gameObj.config.width - 215, 50, 'Player Atk:  ' + playerObj.attack,{ font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);

			//enemy animation
            this.anims.create({
                key: "spider4_anim",
                frames: this.anims.generateFrameNames("spiderDKey", {
                    frames: [20, 21, 22, 23]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
			});
            //activate enemy animation
            this.spiderD.play("spider4_anim");
        
			//collision
            //this adjusts the layers so that you can add a collider
			GroundCollisionLayer.setCollisionByExclusion([-1]);
			WaterCollisionLayer.setCollisionByExclusion([-1]);
			//Makes sure the player cannot cross the map borders
            this.player.setCollideWorldBounds(true);
			//choose which layers the player collides with(array version)
			this.physics.add.collider(this.player, [GroundCollisionLayer, WaterCollisionLayer, QuickSand]);

			//lambda method for creating quicksand
			//takes tile index id 202(center of the quicksand) as parameter
			QuickSand.setTileIndexCallback(202, ()=>{
				//updates player coordinates to the first entrance of the desert area
				this.player.x = 2220; 
				this.player.y = 2400;
			});
			
			//manage camera
			this.physics.world.bounds.width = mapObjDesert.widthInPixels;
			this.physics.world.bounds.height = mapObjDesert.heightInPixels;
			//if the x and y are set to 50, there will be a 50px black edge outside the map when the player moves close
			this.cameras.main.setBounds(0, 0, mapObjDesert.widthInPixels, mapObjDesert.heightInPixels);
			this.cameras.main.startFollow(this.player);
			this.cameras.main.roundPixels = true; // avoid tile bleed, but ineffective in this case
			//general keyboard input
			this.keyboard = this.input.keyboard.addKeys("W, A, S, D, T, E");
			//this key is seperate because it is set up to use a timing parameter when activating the map
			this.keyM = this.input.keyboard.addKey('M');
            //coordinate text
            //this.coordinateText = this.add.text(10, 10, 'Cursors to move', { font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
    }

	
    update() {
			//set coordinate texts
		    /* this.coordinateText.setText([
                'screen x: ' + this.input.x,
                'screen y: ' + this.input.y,
                'world x: ' + this.input.mousePointer.worldX,
                'world y: ' + this.input.mousePointer.worldY
				'Press "E" to enter battle'
		    ]); */
			/*
            this.player.body.setVelocity(0);
			// Horizontal movement
			//if (this.cursors.left.isDown)
			if (this.keyboard.A.isDown && !this.keyboard.D.isDown && !this.keyboard.S.isDown && !this.keyboard.W.isDown)	{
				this.player.body.setVelocityX(-playerObj.playerSpeed);
                if(!this.player.anims.isPlaying){
                    this.player.play('walkingLeft');
                }
			}
			//else if (this.cursors.right.isDown)
			else if (this.keyboard.D.isDown && !this.keyboard.A.isDown && !this.keyboard.S.isDown && !this.keyboard.W.isDown)	{
				this.player.body.setVelocityX(playerObj.playerSpeed);
                if(!this.player.anims.isPlaying){
                    this.player.play('walkingRight');
                }
			}
			// Vertical movement
			//if (this.cursors.up.isDown)
			else if (this.keyboard.S.isDown && !this.keyboard.W.isDown && !this.keyboard.A.isDown && !this.keyboard.D.isDown)	{
				this.player.body.setVelocityY(playerObj.playerSpeed);
                if(!this.player.anims.isPlaying){
                    this.player.play('walkingDown');
                }
			}
            //else if (this.cursors.up.isDown)
            else if (this.keyboard.W.isDown && !this.keyboard.S.isDown && !this.keyboard.A.isDown && !this.keyboard.D.isDown)	{
				this.player.body.setVelocityY(-playerObj.playerSpeed);
                if(!this.player.anims.isPlaying){
                    this.player.play('walkingUp');
                }
			}
            //stops movement and animation when no keys are pressed
            else{
                this.player.anims.stop();
            }
			*/
			this.player.body.setVelocity(0); //players velocity starts at 0
			// Horizontal movement
			//if the a key is held down, change the players velocity
			if (this.keyboard.A.isDown && !this.keyboard.D.isDown && !this.keyboard.S.isDown && !this.keyboard.W.isDown)	{
				this.player.body.setVelocityX(-playerObj.playerSpeed);
				//if the current animation being played is not named "walkingLeft", stop animation
				if (this.player.anims.getCurrentKey() != "walkingLeft") {
					this.player.anims.stop();
				}
				//if no animation is playing, start the animation named "walkingLeft"
				if(!this.player.anims.isPlaying){
                    this.player.play('walkingLeft');
                }
			}
			else if (this.keyboard.D.isDown && !this.keyboard.A.isDown && !this.keyboard.S.isDown && !this.keyboard.W.isDown)	{
				this.player.body.setVelocityX(playerObj.playerSpeed);
				if (this.player.anims.getCurrentKey() != "walkingRight") {
					this.player.anims.stop();
				}
				 if(!this.player.anims.isPlaying){
                    this.player.play('walkingRight');
                }
			}
			// Vertical movement
			else if (this.keyboard.S.isDown && !this.keyboard.W.isDown && !this.keyboard.A.isDown && !this.keyboard.D.isDown)	{
				this.player.body.setVelocityY(playerObj.playerSpeed);
				if (this.player.anims.getCurrentKey() != "walkingDown") {
					this.player.anims.stop();
				}
				if(!this.player.anims.isPlaying){
                    this.player.play('walkingDown');
                }
			}
            else if (this.keyboard.W.isDown && !this.keyboard.S.isDown && !this.keyboard.A.isDown && !this.keyboard.D.isDown)	{
				this.player.body.setVelocityY(-playerObj.playerSpeed);
				if (this.player.anims.getCurrentKey() != "walkingUp") {
					this.player.anims.stop();
				}
				if(!this.player.anims.isPlaying){
                    this.player.play('walkingUp');
                }
			}
            //stops movement and animation when no keys are held down
            else {
                this.player.anims.stop();
            }
			
			// If the player is overlapping with the enemy and the E key is held down
			if (this.physics.overlap(this.player, this.spiderD) && this.keyboard.E.isDown) {
				//update player coordinates
				playerObj.playerX = this.player.x; 
				playerObj.playerY = this.player.y; 
				//set the value of the global variable currentEnemyType to "spider"
				currentEnemyType = "spider";
				//change scene
				this.scene.start('SceneBattle');
			}

			
            //scene change
			//if the players coordinates match
            if(this.player.x <= 30 && this.player.y > 1280 && this.player.y <= 1420){
				//update player coordinates
				playerObj.playerX = 2030; 
				playerObj.playerY = 1650;
				//set the value of the global variable currentBiome to the scene youre trying to enter
				currentBiome = "fire";
				//change scene
                this.scene.start('SceneFire');
            }
            else if(this.player.y < 30 && this.player.x >= 1150 && this.player.x <= 1380){
				playerObj.playerX = 2300; 
				playerObj.playerY = 170;
				currentBiome = "ice";
                this.scene.start('SceneIce');
            }
            else if(this.player.y > 2530 && this.player.x >= 2170 && this.player.x <= 2270){
				playerObj.playerX = 2030; 
				playerObj.playerY = 780;
				currentBiome = "nature";
                this.scene.start('SceneNature');
            }
			//check if the m key is pressed every 200 ms
			if (this.input.keyboard.checkDown(this.keyM, 200)) {
				//update player coordinates
				playerObj.playerX = this.player.x; 
				playerObj.playerY = this.player.y;
				//change scene
                this.scene.start('SceneMap');
            }
	}
}









