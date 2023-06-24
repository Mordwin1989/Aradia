class SceneFire extends Phaser.Scene {
    constructor() {
        super('SceneFire');
    }
    preload() {
			//adding json tilemap
			this.load.tilemapTiledJSON('tilemapKeyF', 'assets/FireMap.json');
			//adding tileset images
			this.load.image('tilesetKeyF', 'assets/1.png');
            this.load.image('tilesetKeyF2', 'assets/dawntree.png');
            this.load.image('tilesetKeyF3', 'assets/TilesetMountains.png');
    }
    create() {
			//using the json preload
			var mapObjFire = this.make.tilemap({ key: 'tilemapKeyF' });
			//using the tileset preload
			var tilesetObj = mapObjFire.addTilesetImage('1', 'tilesetKeyF');
			var tileset2Obj = mapObjFire.addTilesetImage('dawntree', 'tilesetKeyF2');
			var tileset3Obj = mapObjFire.addTilesetImage('TilesetMountains', 'tilesetKeyF3');
            //setting up layers
            var LavaGroundLayer = mapObjFire.createStaticLayer('LavaGroundLayer', tileset3Obj, 0, 0);
            var GroundLayer	= mapObjFire.createStaticLayer('GroundLayer', tilesetObj, 0, 0);
            var RoadLayer = mapObjFire.createStaticLayer('RoadLayer', tilesetObj, 0, 0);
            var TreeCollisionLayer = mapObjFire.createStaticLayer('TreeCollisionLayer', tileset2Obj, 0, 0);
            var CollisionLayer = mapObjFire.createStaticLayer('CollisionLayer', tileset3Obj, 0, 0);
			//adding the enemy 
            this.spiderF = this.physics.add.sprite(1070, 711, 'spiderFKey');
			//scaling up the size of the enemy
			this.spiderF.scale = 1.8;
            //adding the player
            this.player = this.physics.add.sprite(playerObj.playerX, playerObj.playerY, 'playerKey');
			
			//make ui
			this.uiTextG = this.add.text(gameObj.config.width - 215, 10, 'Player Gold: ' + playerObj.gold,{ font: '20px Courier', fill: '#ffffff' }).setScrollFactor(0);
			this.uiTextHp = this.add.text(gameObj.config.width - 215, 30, 'Player Hp:   ' + playerObj.hp,{ font: '20px Courier', fill: '#ffffff' }).setScrollFactor(0);
			this.uiTextAtk = this.add.text(gameObj.config.width - 215, 50, 'Player Atk:  ' + playerObj.attack,{ font: '20px Courier', fill: '#ffffff' }).setScrollFactor(0);
			
			//enemy animation
            this.anims.create({
                key: "spider3_anim",
                frames: this.anims.generateFrameNames("spiderFKey", {
                    frames: [20, 21, 22, 23]
                }),
                frameRate: 8,
                yoyo: true,
                repeat: -1
			});
            //activate enemy animation
            this.spiderF.play("spider3_anim");
        
			//collision
            //this adjusts the layers so that you can add a collider
			CollisionLayer.setCollisionByExclusion([-1]);
			TreeCollisionLayer.setCollisionByExclusion([-1]);
			//Makes sure the player cannot cross the map borders
            this.player.setCollideWorldBounds(true);
			//choose which layers the player collides with
			this.physics.add.collider(this.player, CollisionLayer);
			this.physics.add.collider(this.player, TreeCollisionLayer);
			
			//manage camera
			this.physics.world.bounds.width = mapObjFire.widthInPixels;
			this.physics.world.bounds.height = mapObjFire.heightInPixels;
			this.cameras.main.setBounds(0, 0, mapObjFire.widthInPixels, mapObjFire.heightInPixels);
			this.cameras.main.startFollow(this.player);
			this.cameras.main.roundPixels = true; // avoid tile bleed
			//general keyboard input
			this.keyboard = this.input.keyboard.addKeys("W, A, S, D, T, R, E");
			//this key is seperate because it is set up to use a timing parameter when activating the map
			this.keyM = this.input.keyboard.addKey('M');
            //show cordinates of the mouse
			//this.coordinateText = this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#ffffff' }).setScrollFactor(0);
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
			
			// If the player is overlapping with the enemy and E key is held down
			if (this.physics.overlap(this.player, this.spiderF) && this.keyboard.E.isDown) {
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
            if(this.player.x > 2050 && this.player.y > 1490 && this.player.y < 1770){
				//update player coordinates
				playerObj.playerX = 60; 
				playerObj.playerY = 1325;
				//set the value of the global variable currentBiome to the scene youre trying to enter
				currentBiome = "desert";
				//change scene
				this.scene.start('SceneDesert');
            }
            else if(this.player.x < 30 && this.player.y > 1815 && this.player.y < 2060){
				playerObj.playerX = 2500; 
				playerObj.playerY = 1300;
				currentBiome = "ice";
                this.scene.start('SceneIce');
            }
			if (this.input.keyboard.checkDown(this.keyM, 200)) {
				playerObj.playerX = this.player.x; 
				playerObj.playerY = this.player.y;
                this.scene.start('SceneMap');
            }
	}
}









