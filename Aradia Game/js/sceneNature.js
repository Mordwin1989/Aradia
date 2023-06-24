class SceneNature extends Phaser.Scene {
    constructor() {
        super('SceneNature');
    }
    preload() {	
			//preload of json tilemap
			this.load.tilemapTiledJSON('tilemapKeyN', 'assets/NatureMap.json');
			//adding tileset images
			this.load.image('tilesetKeyN', 'assets/1.png');
            this.load.image('tilesetKeyN2', 'assets/3.png');
            this.load.image('tilesetKeyN3', 'assets/Bridge.png');
            this.load.image('tilesetKeyN4', 'assets/house.png');
            this.load.image('tilesetKeyN5', 'assets/wall.png');
    }
    create() {
			//using the json preload
			var mapObjNature = this.make.tilemap({ key: 'tilemapKeyN' });
			//using the tileset preload
			var tilesetObj = mapObjNature.addTilesetImage('1', 'tilesetKeyN');
			var tileset2Obj = mapObjNature.addTilesetImage('3', 'tilesetKeyN2');
			var tileset3Obj = mapObjNature.addTilesetImage('Bridge', 'tilesetKeyN3');
			var tileset4Obj = mapObjNature.addTilesetImage('house', 'tilesetKeyN4');
			var tileset5Obj = mapObjNature.addTilesetImage('wall', 'tilesetKeyN5');
            //setting up layers
            var GroundFixingLayer = mapObjNature.createStaticLayer('GroundFixingLayer', tilesetObj, 0, 0);
            var GroundLayer = mapObjNature.createStaticLayer('GroundLayer', tilesetObj, 0, 0);
            var RoadLayer = mapObjNature.createStaticLayer('RoadLayer', tilesetObj, 0, 0);
            var MoteCollisionLayer = mapObjNature.createStaticLayer('MoteCollisionLayer', tilesetObj, 0, 0);
            var TreeCollisionLayer = mapObjNature.createStaticLayer('TreeCollisionLayer', tileset2Obj, 0, 0);
            var BridgeLayer = mapObjNature.createStaticLayer('BridgeLayer', tileset3Obj, 0, 0);
            var WallLayer = mapObjNature.createStaticLayer('WallLayer', tileset5Obj, 0, 0);
            var HouseLayer = mapObjNature.createStaticLayer('HouseLayer', tileset4Obj, 0, 0);
			
			//add enemy (x,y,key)
            this.spiderN = this.physics.add.sprite(1000, 110, 'spiderNKey');
			//add player
            this.player = this.physics.add.sprite(playerObj.playerX, playerObj.playerY, 'playerKey');
			//setting up the last layer on top of the player
            var HoverLayer 	= mapObjNature.createStaticLayer('HoverLayer', 	tileset2Obj, 0, 0);
			
			//make ui
			this.uiTextG = this.add.text(gameObj.config.width - 215, 10, 'Player Gold: ' + playerObj.gold,{ font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
			this.uiTextHp = this.add.text(gameObj.config.width - 215, 30, 'Player Hp:   ' + playerObj.hp,{ font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
			this.uiTextAtk = this.add.text(gameObj.config.width - 215, 50, 'Player Atk:  ' + playerObj.attack,{ font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
			this.uiTextInst = this.add.text(10, 10, 'Press "E" to enter battle', { font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
			
            //make enemy animation
            this.anims.create({
                key: "spider1_anim",
                frames: this.anims.generateFrameNames("spiderNKey", {
                    frames: [20, 21, 22, 23]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
			});
            //activate enemy animation
            this.spiderN.play("spider1_anim");
        
			//collision
            //
			MoteCollisionLayer.setCollisionByExclusion([-1]);
			TreeCollisionLayer.setCollisionByExclusion([-1]);
			//Makes sure the player cannot cross the map borders
            this.player.setCollideWorldBounds(true);
			//make collision between the player and certain layers
			this.physics.add.collider(this.player, MoteCollisionLayer);
			this.physics.add.collider(this.player, TreeCollisionLayer);			
			
			//manage camera
			this.physics.world.bounds.width = mapObjNature.widthInPixels;
			this.physics.world.bounds.height = mapObjNature.heightInPixels;
			//if the x and y are set to 50, there will be a 50px black edge outside the map when the player moves close
			this.cameras.main.setBounds(0, 0, mapObjNature.widthInPixels, mapObjNature.heightInPixels);//x,y,w,h 
			this.cameras.main.startFollow(this.player);
			this.cameras.main.roundPixels = true; // avoid tile bleed
			//general keyboard input
			this.keyboard = this.input.keyboard.addKeys("W, A, S, D, T, E");
			//this key is seperate because it is set up to use a timing parameter when activating the map
			this.keyM = this.input.keyboard.addKey('M'); 
        
            // this.coordinateText = this.add.text(10, 40, 'Cursors to move', { font: '20px Courier', fill: '#ff0000' }).setScrollFactor(0);
    }

	
    update() {
            //set coordinate texts
			/* this.coordinateText.setText([
				'screen x: ' + this.input.x,
				'screen y: ' + this.input.y,
				'world x: ' + this.input.mousePointer.worldX,
				'world y: ' + this.input.mousePointer.worldY 
			]); */

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
			if (this.physics.overlap(this.player, this.spiderN) && this.keyboard.E.isDown) {
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
            if(this.player.x > 990 && this.player.x < 1090 && this.player.y <= 490 && this.player.y > 450){
				//update player coordinates
				playerObj.playerX = 1165; 
				playerObj.playerY = 170;
				//set the value of the global variable currentBiome to the scene youre trying to enter
				currentBiome = "city";
				//change scene
                this.scene.start('SceneCity');
            }
            else if(this.player.x < 30 && this.player.y >= 860 && this.player.y <= 940){
				playerObj.playerX = 1230; 
				playerObj.playerY = 2500;
				currentBiome = "ice";
                this.scene.start('SceneIce');
            }
            else if(this.player.x > 2050 && this.player.y > 720 && this.player.y < 810){
				playerObj.playerX = 2220; 
				playerObj.playerY = 2520;
				currentBiome = "desert";
                this.scene.start('SceneDesert');
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