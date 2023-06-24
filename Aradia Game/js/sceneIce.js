class SceneIce extends Phaser.Scene {
    constructor() {
        super('SceneIce');
    }
    preload() {
			//adding json tilemap
			this.load.tilemapTiledJSON('tilemapKeyI', 'assets/IceMap.json');
			//adding tileset images
			this.load.image('tilesetKeyI', 'assets/1.png');
            this.load.image('tilesetKeyI2', 'assets/ice_tileset.png');
            this.load.image('tilesetKeyI3', 'assets/tileset_other.png');
    }
    create() {
			//using the json preload
			var mapObjIce = this.make.tilemap({ key: 'tilemapKeyI' });
			//using the tileset preload
			var tilesetObj = mapObjIce.addTilesetImage('1', 'tilesetKeyI');
			var tileset2Obj = mapObjIce.addTilesetImage('ice_tileset', 'tilesetKeyI2');
			var tileset3Obj = mapObjIce.addTilesetImage('tileset_other', 'tilesetKeyI3');
            //setting up layers
            var GroundLayer = mapObjIce.createStaticLayer('GroundLayer', tileset2Obj, 0, 0);
            var WaterLayer = mapObjIce.createStaticLayer('WaterLayer', tilesetObj, 0, 0);
            var RoadLayer = mapObjIce.createStaticLayer('RoadLayer', tilesetObj, 0, 0);
            var CaveEntranceLayer = mapObjIce.createStaticLayer('CaveEntranceLayer', tileset2Obj, 0, 0);
            var CollisionLayer = mapObjIce.createStaticLayer('CollisionLayer', tileset2Obj, 0, 0);
            var TreeCollisionLayer = mapObjIce.createStaticLayer('TreeCollisionLayer', tileset3Obj, 0, 0);
            var WaterCollisionLayer = mapObjIce.createStaticLayer('WaterCollisionLayer', tilesetObj, 0, 0);
            //adding the enemy
            this.spiderI = this.physics.add.sprite(1232, 950, 'spiderIKey');
			//scaling up the size of the enemy
			this.spiderI.scale = 1.5;
			//adding the player
            this.player = this.physics.add.sprite(playerObj.playerX, playerObj.playerY, 'playerKey');
			
			//make ui
			this.uiTextG = this.add.text(gameObj.config.width - 215, 10, 'Player Gold: ' + playerObj.gold,{ font: '20px Courier', fill: '#ff00ff' }).setScrollFactor(0);
			this.uiTextHp = this.add.text(gameObj.config.width - 215, 30, 'Player Hp:   ' + playerObj.hp,{ font: '20px Courier', fill: '#ff00ff' }).setScrollFactor(0);
			this.uiTextAtk = this.add.text(gameObj.config.width - 215, 50, 'Player Atk:  ' + playerObj.attack,{ font: '20px Courier', fill: '#ff00ff' }).setScrollFactor(0);
			
			//enemy animation
            this.anims.create({
                key: 'spider2_anim',
                frames: this.anims.generateFrameNames("spiderIKey", {
                    frames: [20, 21, 22, 23]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
			});
            //activate enemy animation
            this.spiderI.play("spider2_anim");
        
			//collision
            //sets collision on all tiles of a given layer
			CollisionLayer.setCollisionByExclusion([-1]);
			WaterCollisionLayer.setCollisionByExclusion([-1]);
			TreeCollisionLayer.setCollisionByExclusion([-1]);
			//Makes sure the player cannot cross the map borders
            this.player.setCollideWorldBounds(true);
			//adds collision between the player and certain layers
			this.physics.add.collider(this.player, CollisionLayer);
			this.physics.add.collider(this.player, WaterCollisionLayer);
			this.physics.add.collider(this.player, TreeCollisionLayer);
			
			
			//manage camera
			this.physics.world.bounds.width = mapObjIce.widthInPixels;
			this.physics.world.bounds.height = mapObjIce.heightInPixels;
			//if the x and y are set to 50, there will be a 50px black edge outside the map when the player moves close
			this.cameras.main.setBounds(0, 0, mapObjIce.widthInPixels, mapObjIce.heightInPixels); //x,y,w,h
			this.cameras.main.startFollow(this.player);
			this.cameras.main.roundPixels = true; // avoid tile bleed
			//general keyboard input
			this.keyboard = this.input.keyboard.addKeys("W, A, S, D, T, E");
			//this key is seperate because it is set up to use a timing parameter when activating the map
			this.keyM = this.input.keyboard.addKey('M');
			
			//weather damage
			this.timedEvent = this.time.addEvent({
				delay: 2000, 
				callback: this.biomeEffect,
				callbackScope: this,
				loop: true
			});
			
            //coordinate text
            //this.coordinateText = this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#ff00ff' }).setScrollFactor(0);
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
            
			/* //older simple version
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
			if (this.physics.overlap(this.player, this.spiderI) && this.keyboard.E.isDown) {
				console.log("hi");
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
            if(this.player.x >= 2530 && this.player.y > 1200 && this.player.y <= 1400){
				//update player coordinates
				playerObj.playerX = 40; 
				playerObj.playerY = 1905;
				//set the value of the global variable currentBiome to the scene youre trying to enter
				currentBiome = "fire";
				//change scene
                this.scene.start('SceneFire');
            }
            else if(this.player.y > 2530 && this.player.x > 1140 && this.player.x <= 1360){
				playerObj.playerX = 60; 
				playerObj.playerY = 915;
				currentBiome = "nature";
                this.scene.start('SceneNature');
            }
            else if(this.player.y <= 115 && this.player.x >= 2272 && this.player.x <= 2336){
				playerObj.playerX = 1220; 
				playerObj.playerY = 60;
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
	biomeEffect(){
		//decrease player hp
		playerObj.hp -= 3;
		//check health status
		if(playerObj.hp <= 0){
			this.scene.start("SceneDeath");
		}
		//refresh gui
		this.uiTextHp.setText('Player Hp:   ' + playerObj.hp);
		//tint player sprite
		this.player.setTint(0xff0000);
		//untint player sprite after ms delay
		this.timedEvent = this.time.addEvent({
			delay: 100,// ms
			callback: this.resetPColor,
			callbackScope: this
		})
	}
	resetPColor(){
		this.player.clearTint();
	}
}









