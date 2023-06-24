
class SceneCity extends Phaser.Scene {
    constructor() {
        super('SceneCity');
    }
    preload() {
			//adding the json tilemap
			this.load.tilemapTiledJSON('tilemapKeyC', 'assets/CityMap.json');
			//adding tileset images
			this.load.image('tilesetKeyC', 'assets/ChieftainHouse1.png');
            this.load.image('tilesetKeyC2', 'assets/house.png');
            this.load.image('tilesetKeyC3', 'assets/TradeStall.png');
            this.load.image('tilesetKeyC4', 'assets/ExtraDecor.png');
            this.load.image('tilesetKeyC5', 'assets/tileset_other.png');
            this.load.image('tilesetKeyC6', 'assets/TilesetMountains.png');
            this.load.image('tilesetKeyC7', 'assets/wall.png');
            this.load.image('tilesetKeyC8', 'assets/1.png');
			//load the npc merchant
			this.load.spritesheet('basicNpcKey', 'assets/basicNpc.png', {frameWidth: 32, frameHeight: 32});
			//load the player
			this.load.spritesheet('playerKey', 'assets/george2.png', {frameWidth: 29, frameHeight: 32}); 
    }
    create() {
			//using the json preload
            var mapObjCity = this.make.tilemap({ key: 'tilemapKeyC' });
            //using the tileset preload
            var tilesetObj = mapObjCity.addTilesetImage('ChieftainHouse1', 'tilesetKeyC');
            var tileset2Obj = mapObjCity.addTilesetImage('house', 'tilesetKeyC2');
            var tileset3Obj = mapObjCity.addTilesetImage('TradeStall', 'tilesetKeyC3');
            var tileset4Obj = mapObjCity.addTilesetImage('ExtraDecor', 'tilesetKeyC4');
            var tileset5Obj = mapObjCity.addTilesetImage('tileset_other', 'tilesetKeyC5');
            var tileset6Obj = mapObjCity.addTilesetImage('TilesetMountains','tilesetKeyC6');
            var tileset7Obj = mapObjCity.addTilesetImage('wall', 'tilesetKeyC7');
            var tileset8Obj = mapObjCity.addTilesetImage('1', 'tilesetKeyC8');
            //setting up layers
            var GroundFixingLayer = mapObjCity.createStaticLayer('GroundFixingLayer', tileset8Obj, 0, 0);
            var GroundAndRoadLayer = mapObjCity.createStaticLayer('GroundAndRoadLayer', tileset8Obj, 0, 0);
            var DirtLayer = mapObjCity.createStaticLayer('DirtLayer', tileset6Obj, 0, 0);
            var WallLayer = mapObjCity.createStaticLayer('WallLayer', tileset7Obj, 0, 0);
            var HousesColored = mapObjCity.createStaticLayer('HousesColored', tileset5Obj, 0, 0);
            var DoorsForInteractionColored = mapObjCity.createStaticLayer('DoorsForInteractionColored',	tileset5Obj, 0, 0);
            var DoorsForInteractionStandard = mapObjCity.createStaticLayer('DoorsForInteractionStandard', tileset2Obj, 0, 0);
            var DoorsForInteractionChieftain = mapObjCity.createStaticLayer('DoorsForInteractionChieftain', tilesetObj, 0, 0);
            var Plants = mapObjCity.createStaticLayer('Plants', tileset6Obj, 0, 0);
            var ExtraDecor = mapObjCity.createStaticLayer('ExtraDecor', tileset4Obj, 0, 0);
			//adding NPC
			this.trader = this.physics.add.sprite(800,1500,'basicNpcKey', 2);
            //adding the player
            this.player = this.physics.add.sprite(playerObj.playerX, playerObj.playerY, 'playerKey'); 
			//the rest of the layers
            var Stalls = mapObjCity.createStaticLayer('Stalls', tileset3Obj, 0, 0);
            var StallCorners = mapObjCity.createStaticLayer('StallCorners', tileset3Obj, 0, 0);
            var HouseStandard = mapObjCity.createStaticLayer('HouseStandard', tileset2Obj, 0, 0);
            var ChieftainHouse = mapObjCity.createStaticLayer('ChieftainHouse', tilesetObj, 0, 0);
			
			//make ui
			this.uiTextG = this.add.text(gameObj.config.width - 215, 10, 'Player Gold: ' + playerObj.gold,{ font: '20px Courier', fill: '#ffffff' }).setScrollFactor(0);
			this.uiTextHp = this.add.text(gameObj.config.width - 215, 30, 'Player Hp:   ' + playerObj.hp,{ font: '20px Courier', fill: '#ffffff' }).setScrollFactor(0);
			this.uiTextAtk = this.add.text(gameObj.config.width - 215, 50, 'Player Atk:  ' + playerObj.attack,{ font: '20px Courier', fill: '#ffffff' }).setScrollFactor(0);
			
			//collision
			//this adjusts the layers so that you can add a collider
			WallLayer.setCollisionByExclusion([-1]);
			Stalls.setCollisionByExclusion([-1]);
			ChieftainHouse.setCollisionByExclusion([-1]);
			HouseStandard.setCollisionByExclusion([-1]);
			HousesColored.setCollisionByExclusion([-1]);
			ExtraDecor.setCollisionByExclusion([-1]);
			//Makes sure the player cannot cross the map borders
            this.player.setCollideWorldBounds(true);
            //make collision between the player and individual layers
			this.physics.add.collider(this.player, WallLayer);
			this.physics.add.collider(this.player, Stalls);
			this.physics.add.collider(this.player, ChieftainHouse);
			this.physics.add.collider(this.player, HouseStandard);
			this.physics.add.collider(this.player, HousesColored);
			this.physics.add.collider(this.player, ExtraDecor);
			
			//manage camera
			this.physics.world.bounds.width = mapObjCity.widthInPixels;
			this.physics.world.bounds.height = mapObjCity.heightInPixels;
			this.cameras.main.setBounds(0, 0, mapObjCity.widthInPixels, mapObjCity.heightInPixels);
			this.cameras.main.startFollow(this.player);
			this.cameras.main.roundPixels = true; // avoid tile bleed
			//keyboard input
			this.keyboard = this.input.keyboard.addKeys("W, A, S, D, T, R");
			//alternative keyboard input method
			this.keyE = this.input.keyboard.addKey('E');
			this.keyM = this.input.keyboard.addKey('M');
			//show cordinates of the mouse
			/* this.coordinateText = this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#ffffff' }).setScrollFactor(0); */
			
			//adds text for potion purchase
			this.potionPurchase = this.add.text(
				this.trader.x - 60,
				this.trader.y - 50,
				"Press E to buy potion",
				{font: "22px Arial", fill: "#fff"});
			}

	
    update() {
			//set coordinate texts
			/* this.coordinateText.setText([
			'screen x: ' + this.input.x,
			'screen y: ' + this.input.y,
			'world x: ' + this.input.mousePointer.worldX,
			'world y: ' + this.input.mousePointer.worldY
			]); */
		
			this.player.body.setVelocity(0);
			// Horizontal movement
			if (this.keyboard.A.isDown && !this.keyboard.D.isDown && !this.keyboard.S.isDown && !this.keyboard.W.isDown)	{
				this.player.body.setVelocityX(-playerObj.playerSpeed);
				if (this.player.anims.getCurrentKey() != "walkingLeft") {
					this.player.anims.stop();
				}
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
            //stops movement and animation when no keys are pressed
            else{
                this.player.anims.stop();
            }
			//scene changes
            if (this.player.y <= 70) {
				playerObj.playerX = 1040; 
				playerObj.playerY = 400;
				currentBiome = "nature";
                this.scene.start('SceneNature');
            }
			if (this.input.keyboard.checkDown(this.keyM, 200)) {
				playerObj.playerX = this.player.x; 
				playerObj.playerY = this.player.y;
                this.scene.start('SceneMap');
            }
			
			//buying potions from the npc
		if (this.physics.overlap(this.player, this.trader) && this.input.keyboard.checkDown(this.keyE, 200)) {
            if(playerObj.gold >= 20){
				console.log("purchase done");
                //buy potion
                playerObj.gold -= 20;
                console.log(playerObj.gold);
                //add potion to player
                playerObj.inventory.push('potion');
                this.potionPurchase.setText("you got a potion");
				this.uiTextG.setText('Player gold: ' + playerObj.gold);
            } else {
                console.log("purchase failed");
                console.log(playerObj.gold);
                //set text
                this.potionPurchase.setText("you are too poor");
                }
            this.textFloatAway(this.potionPurchase,this.trader.y-50);
        }
			 
	}
	
	textFloatAway(textObj, resetLocation) {
		try {
            this.tweenText.stop();
        } catch {	
		}
        textObj.y = resetLocation;
        textObj.alpha = 1;
        this.tweenText = this.tweens.add({
            targets: textObj,
            duration: 1000, 
            delay: 300,
            y: textObj.y-10, 
            alpha:0, 
        });
    }
}