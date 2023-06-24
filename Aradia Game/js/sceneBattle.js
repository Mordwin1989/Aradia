		//one global object
		var spellBook = [];
		
		
class SceneBattle extends Phaser.Scene {
    constructor( ) { 
        super('SceneBattle');
    }
	
  preload() {
	}

  create() {
	  		
		this.mainBattleMenu = ['Attack', 'Spellbook', 'Items', 'Flee'];
		this.selectedLeftSide = 0; //stores which item is selected/hovered over in the left box
		this.selectedRightSide = 0; //stores which item is selected/hovered over in the right box
		this.activeMenuLeftSideTexts = []; //stores the currently out printed texts in the left box
		this.activeMenuRightSideTextsR = []; //stores the currently out printed texts in the left box
		this.menuSpeedInMS = 500; //menu speed in ms
		this.isMainMenuHasActive = false; //stores if a submenu is in use  

	  	//variables for use
		this.gameWidth1pc = gameObj.config.width*0.01, 	
		this.gameHeight60pc	= gameObj.config.height*0.60,
		this.gameWidth50pc = gameObj.config.width/2
		
		this.changeBackground();
		
		//add new player sprite
		this.player = this.physics.add.sprite(gameObj.config.width*0.20, gameObj.config.height*0.30, 'playerKey', 3);

		//add seperated inputs
		this.keyS = this.input.keyboard.addKey('S');
		this.keyW = this.input.keyboard.addKey('W');
		this.keyQ = this.input.keyboard.addKey('Q');
		this.keySPACE = this.input.keyboard.addKey('SPACE');
		
		//draw the two box below
		this.drawBox();
		//no method to handle a change in font size
		this.styleBasicWhite = { font: '20px Arial', fill: '#fff'}; //white
		this.currentEnemyList = [];
		
		//outline of the player hp bar
		this.graphicsBg = this.add.graphics();
		this.graphicsBg.fillStyle(0xFF0000, 1.0);
		this.graphicsBg.fillRect(0,10,200,30); //x,y,width,height
		//inner black part of the hpbar
		this.graphicsMid = this.add.graphics();
		this.graphicsMid.fillStyle(0x404040, 1.0);
		this.graphicsMid.fillRect(2,12,196,26); //2 pixel border
		//creating graphics for the inner hpbar
		//graphicsHpBar is updated in the refreshHpBar method
		this.graphicsHpBar = this.add.graphics();
		
		this.hpBarNum = this.add.text( //text
			gameObj.config.width*0.03,
			gameObj.config.width*0.03 + 25 ,
			"",
			{font: "20px Arial", fill: "#fff"}).setScrollFactor(0);
			
		//outline of the enemy hp bar
		this.graphicsEBg = this.add.graphics();
		this.graphicsEBg.fillStyle(0xFF0000, 1.0);
		this.graphicsEBg.fillRect(gameObj.config.width - 200,10,200,30);
		//inner black part of the hpbar
		this.graphicsEMid = this.add.graphics();
		this.graphicsEMid.fillStyle(0x404040, 1.0);
		this.graphicsEMid.fillRect(gameObj.config.width - 198,12,196,26); //2 pixel border
		//creating graphics for the inner hpbar
		//graphicsHpBar is updated in the refreshHpBar method
		this.graphicsEHpBar = this.add.graphics();
		this.hpBarENum = this.add.text(
			gameObj.config.width - 180, 
			50,
			"",
			{font: "20px Arial", fill: "#fff"}).setScrollFactor(0);
			
		//drawing exp bar
		this.graphicsBgExp=this.add.graphics();
		this.graphicsBgExp.fillStyle(0x00FFFF, 1.0);
		this.graphicsBgExp.fillRect(
			this.gameWidth1pc,
			this.gameHeight60pc - this.gameWidth1pc - 20, //box - a margin (between box and exp bar) - height of the bar
			gameObj.config.width - this.gameWidth1pc - this.gameWidth1pc, //length - two margin from both side
			20);
		this.graphicsBgExp=this.add.graphics();
		this.graphicsBgExp.fillStyle(0xffffff, 1.0);
		this.graphicsBgExp.fillRect(
			this.gameWidth1pc + 3, //original + border
			this.gameHeight60pc - this.gameWidth1pc - (20 - 3), //original - border
			gameObj.config.width - this.gameWidth1pc - this.gameWidth1pc - 6, //original - border from both sides
			20 - 6); //original - border from both sides
		
		this.graphicsBgExp=this.add.graphics();

		this.lvlNum = this.add.text(
			this.player.x - 25,
			this.player.y - 40,
			"Lvl : " + playerObj.lvl,
			{font: "20px Arial", fill: "#fff"}).setScrollFactor(0);
		
		//enemy animation
		for(var i = 0; i < allEnemies.length; i++){
			this.anims.create({
            key: allEnemies[i].animKey,
            frames: this.anims.generateFrameNames(allEnemies[i].spriteKey,{
				frames: [11,12,13,14,15,16,17,18]
			}),
            frameRate: 8,
            repeat: -1
			});
		}
		
		//enemies death animation
		for (var i = 0; i < allEnemies.length; i++) {
			this.anims.create({
            key: allEnemies[i].animDeathKey,
            frames: this.anims.generateFrameNames(allEnemies[i].spriteKey,{
				frames: [11,40,41,42,43]
			}),
            frameRate: 6,
            repeat: 1
			});
		}
		
		//refresh information
		if (isItNew) {
			this.updateNewBattleScene();
			console.log("updated BATTLE SCENE");
			isItNew = false;
		}
	}

	update() {
	  	//scroll down in the right menu
		if (this.input.keyboard.checkDown(this.keyS, this.menuSpeedInMS)) {
			//check if we are in the right side
			if (!this.isMainMenuHasActive) {
				//decolor the current one
				this.activeMenuLeftSideTexts[this.selectedLeftSide].setColor('#fff'); //white
				//loop the scroll and select the new one
				if (this.selectedLeftSide < this.activeMenuLeftSideTexts.length - 1) {
					this.selectedLeftSide++;
				} else {
					this.selectedLeftSide = 0;
				}
				//color the new selected
				this.activeMenuLeftSideTexts[this.selectedLeftSide].setColor('#ff0000'); //red
			} else if (this.isMainMenuHasActive) {//else scrolls at the right side (this.activeMenuRightSideTextsR) 
				//decolor the current one
				this.activeMenuRightSideTextsR[this.selectedRightSide].setColor('#fff');
				//loop the scroll and select the new one
				if (this.selectedRightSide < this.activeMenuRightSideTextsR.length - 1) {
					this.selectedRightSide++;
				} else {
					this.selectedRightSide = 0;
				}
				//color the new selected
				this.activeMenuRightSideTextsR[this.selectedRightSide].setColor('#ff0000');
			}
		}
		
		//Scroll up in the right menu
		if (this.input.keyboard.checkDown(this.keyW, this.menuSpeedInMS)) {
			if (!this.isMainMenuHasActive) {
				this.activeMenuLeftSideTexts[this.selectedLeftSide].setColor('#fff');
				if (this.selectedLeftSide != 0) {
					this.selectedLeftSide--;
				} else {
					this.selectedLeftSide = this.activeMenuLeftSideTexts.length - 1;
				}
				this.activeMenuLeftSideTexts[this.selectedLeftSide].setColor('#ff0000');
			} else if (this.isMainMenuHasActive) {
				this.activeMenuRightSideTextsR[this.selectedRightSide].setColor('#fff');
				if (this.selectedRightSide!= 0) {
					this.selectedRightSide--;
				} else {
					this.selectedRightSide = this.activeMenuRightSideTextsR.length - 1;
				}
				this.activeMenuRightSideTextsR[this.selectedRightSide].setColor('#ff0000');
			}
		}
	
		//Chose the currently selected line and execute
		if (this.input.keyboard.checkDown(this.keySPACE, this.menuSpeedInMS)) {
			//checks if we are entering INTO a submenu
			if (!this.isMainMenuHasActive) {
				this.isMainMenuHasActive = true;
				// see which menu we are entering INTO
				switch (this.selectedLeftSide) {
					case 0: //attack
						this.enemyNameList = [];
						for (var i = 0; i < this.currentEnemyList.length; i++) {
							this.enemyNameList.push(this.currentEnemyList[i].name);
						}
						this.listMenu(this.enemyNameList, false, { font: '20px Arial', fill: '#fff'});
						break;
					case 1: //spells
						//use listmenu instead!
						this.activeMenuRightSideTextsR.push(this.add.text(
							this.gameWidth50pc+10,
							this.gameHeight60pc+10,
							"You have no spells.", { font: '20px Arial', fill: '#fff'}));
						break;
					case 2: //items
						if (playerObj.inventory.length !== 0) {
							this.listMenu(playerObj.inventory, false, { font: '20px Arial', fill: '#fff'});
						} else {
						//use listmenu instead!
							this.activeMenuRightSideTextsR.push(this.add.text(
								this.gameWidth50pc+10,
								this.gameHeight60pc+10,
								"You have no items.", { font: '20px Arial', fill: '#fff'}));
						}
						break;
					case 3: //flee
						//back to the map
						this.exitBattleScene();
						break;
				}
			//if we are IN a submenu
			} else {
				//see which menu we are IN
				switch(this.selectedLeftSide) {
					case 0: //attack
					//1. player attacks, receive exp, death anim, take out from list
						this.playerAttack();
					//2. the list of enemies dissapear
						this.hideRightMenu();
					//3. update exp bar (we may have received exp)
						this.refreshExpBar();
						//if there is no more enemies
						if (this.currentEnemyList.length == 0) {
							//to not break the code
							this.input.keyboard.enabled = false;
						for(var i = 0; i < allEnemies.length; i++){
							if (allEnemies[i].biome == currentBiome && allEnemies[i].type == currentEnemyType) {
								this.add.text(this.gameWidth50pc-150, gameObj.config.height*0.15, "You won! There is " + allEnemies[i].gold + " gold and " + allEnemies[i].exp + " exp!", { font: '20px Arial'});
							}
						}
							this.timedEvent = this.time.addEvent({ delay: 3000, callback: this.exitBattleScene, callbackScope: this });
						}
						//if there are more enemies they attack
						this.enemyAttack();
						this.refreshHpBar();
						break;
					case 1: //spells
						this.hideRightMenu();
						break;
					case 2: //inventory
						//if there is sth to be used
						if (playerObj.inventory.length !== 0) {
							this.useItem();
							this.enemyAttack();
							this.refreshHpBar();
						}
						this.hideRightMenu();
						break;
					case 3: //in case of bug+text purposes 
						this.isMainMenuHasActive = false;
						break;
				}
				
			}
		}
		
		//leave current submenu with the key Q or do nothing
		if (this.input.keyboard.checkDown(this.keyQ, this.menuSpeedInMS) && this.isMainMenuHasActive == true) {
			this.isMainMenuHasActive = false;
			this.selectedRightSide = 0;
			this.hideRightMenu();
		}
	}
	
	//once there will be classes this can be merged with spawnEnemy()
	enemySelector() {
		var returnList = [];
		for(var i = 0; i < allEnemies.length; i++){
			if (allEnemies[i].biome == currentBiome && allEnemies[i].type == currentEnemyType) {
				//not the most elegant solution but works. copy of the original objects
				returnList.push({
					"biome" :	 	allEnemies[i].biome,
					"type" :	 	allEnemies[i].type,
					"name" :	 	allEnemies[i].name,
					"maxHp" : 		allEnemies[i].maxHp,
					"hp" : 			allEnemies[i].hp,
					"attack" : 		allEnemies[i].attack,
					"spriteKey" :	allEnemies[i].spriteKey,
					"animKey" : 	allEnemies[i].animKey,
					"animDeathKey" : allEnemies[i].animDeathKey,
					"exp" : 		allEnemies[i].exp,
					"gold" :        allEnemies[i].gold
				});
			}
		}
		return returnList;
	}
	
	//Spawns enemy
	//Now only places them there
	spawnEnemy() {
		//once the enemy objects are sprites, the enemySelector() should be merge into this method
		var heightCount;
		var enemySpawnX = gameObj.config.width*0.80;
		var enemySpawnY = this.gameHeight60pc;
		switch(this.currentEnemyList.length) {
			case 1:
				heightCount = 0.5;
				this.enemy1 = this.physics.add.sprite(enemySpawnX, enemySpawnY*heightCount*1, this.currentEnemyList[0].spriteKey, 11);
				//start enemy animation
				this.enemy1.play(this.currentEnemyList[0].animKey);
				if(currentBiome == "fire"){
					this.enemy1.scale = 1.8;
				}
				break;
			// case 2:
				// heightCount = 0.3;
				// this.enemy1 = this.physics.add.sprite(enemySpawnX, enemySpawnY*heightCount*1, 'enemy');
				// this.enemy2 = this.physics.add.sprite(enemySpawnX, enemySpawnY*heightCount*2, 'enemy');
				// break;
			// case 3:
				// heightCount = 0.25;
				// this.enemy1 = this.physics.add.sprite(enemySpawnX, enemySpawnY*heightCount*1, 'enemy');
				// this.enemy2 = this.physics.add.sprite(enemySpawnX, enemySpawnY*heightCount*2, 'enemy');
				// this.enemy3 = this.physics.add.sprite(enemySpawnX, enemySpawnY*heightCount*3, 'enemy');
				// break;
		}
	}
  
	/***
	Handles everything about listing menu on the LEFT or RIGHT side
	- 1. list of stings needed to be printed
	  2. boolean to see if it belong on the left side
	  3. text style 
	- puts menu items into this.activeMenuLeftSideTexts & this.activeMenuRightSideTextsR
	- color the first element
	***/
	listMenu(menuList, onLeft, printedStyle) {
		//print left side
		if (onLeft) {
			for (var i = 0; i < menuList.length; i++) {
				this.activeMenuLeftSideTexts.push(
					this.add.text(
						this.gameWidth1pc+10, 
						//1. start of the box 2. small margin for the box 3. Y distance between text
						this.gameHeight60pc+10+(i*30), 
						i+1 + ". " + menuList[i].toString(), printedStyle));
			}
			//colors first menu item
				this.activeMenuLeftSideTexts[this.selectedLeftSide].setColor('#ff0000'); 
		
		//print right side
		} else if (onLeft == false) {
			//if more item than space
			if (menuList.length*40 > gameObj.config.height-this.gameHeight60pc) {
				//fitInBox stores how many fits
				var fitInBox = ((gameObj.config.height-this.gameHeight60pc)-30)/30 | 0;
					//first column
						for (var i = 0; i < fitInBox; i++) {
							//temporarly store the texts for later modifications
							this.activeMenuRightSideTextsR.push(
								this.add.text(
									this.gameWidth50pc+10,
									this.gameHeight60pc+10+(i*30),
									i+1 + ". " + menuList[i].toString(), printedStyle)
								);
						}
					//second column
						for (var i = fitInBox; i < fitInBox*2 && i < menuList.length; i++) {
							//temporarly store the texts for later modifications
							this.activeMenuRightSideTextsR.push(
								this.add.text(
									gameObj.config.width*0.75,
									this.gameHeight60pc+10+((i-fitInBox)*30),
									i+1 + ". " + menuList[i].toString(), printedStyle)
								);
						}
			} else {
				//if this one does not need multiple columns
				for (var i = 0; i < menuList.length; i++) {
					//temporarly store the texts for later modifications
					this.activeMenuRightSideTextsR.push(
						this.add.text(
							this.gameWidth50pc+10,
							this.gameHeight60pc+10+(i*30),
							i+1 + ". " + menuList[i].toString(), printedStyle)
					);
				}
			}
			//this if statement is a temporary bandaid solution
			//colors first menu item
            if (this.activeMenuRightSideTextsR.length != 0) {
                this.activeMenuRightSideTextsR[this.selectedRightSide].setColor('#ff0000');
            }
		}
	}
	
	//Hides the current items at right menu side.
	//Did not preload, because items and enemies needs to be reloaded each time
	hideRightMenu() {
		for (var i = this.activeMenuRightSideTextsR.length; i > 0; i--) {
			this.activeMenuRightSideTextsR.pop().alpha = 0;
		}
		//set them to default
		this.selectedRightSide = 0;
		this.isMainMenuHasActive = false;
	}
	
	//Draw out the two box below
	drawBox() {
		this.graphics = this.add.graphics();
		this.graphics.lineStyle(5, 0xffffff); //white
        this.graphics.fillStyle(0x000000, 1);
		//black background for the menus and exp bar
		this.graphics.fillRect(
            0,
            this.gameHeight60pc-20-this.gameWidth1pc-this.gameWidth1pc,
            gameObj.config.width,
            gameObj.config.height
        );
        this.graphics.strokeRect(
		//distance from left wall 		- 1% of scene size
			this.gameWidth1pc, 	
		//distance from top 			- 60% of scene size
			this.gameHeight60pc, 	
		//distance from first value		- half scene minus first 1% minus the box line's size
			this.gameWidth50pc - this.gameWidth1pc - 5, 	
		//distance from second value	- last 40% minus the same distance from bottom as first value
			gameObj.config.height * 0.40 - (this.gameWidth1pc));
        this.graphics.strokeRect(
		//distance from left wall 		- from half of scene size plus bix size
			this.gameWidth50pc + 5,
		//distance from top 			- 60% of scene size
			this.gameHeight60pc,	
		//distance from first value		- 'til the end minus the first value
			this.gameWidth50pc - this.gameWidth1pc - 5, 	
		//distance from second value	- last 40%- minus the same distance from bottom as first value
			gameObj.config.height * 0.40 - (this.gameWidth1pc));
	}
	
	useItem() {
		//takes out object
		playerObj.inventory.splice(this.selectedRightSide, 1);
		//effect of item
		playerObj.hp += 50;
		if (playerObj.hp > playerObj.maxHp) {
			playerObj.hp = playerObj.maxHp;
		}
		//refresh hpbar
		this.refreshHpBar();
	}
	
	//reduces the hp of the chosen enemy
	playerAttack() {
		this.currentEnemyList[this.selectedRightSide].hp -= playerObj.attack;
		if (this.currentEnemyList[this.selectedRightSide].hp <= 0) {
			//calculate exp
			playerObj.currentExp += this.currentEnemyList[this.selectedRightSide].exp;
			playerObj.gold += this.currentEnemyList[this.selectedRightSide].gold;
			//death animation
			//once the enemyobject is sprite, this needs to be changed
			this.enemy1.play(this.currentEnemyList[0].animDeathKey);
			//take out from the list
			this.currentEnemyList.splice(this.selectedRightSide, 1);
		}
	}
	
	//reduces the player's hp, and checks if the player dead or not
	enemyAttack() {
		for (var i = 0; i < this.currentEnemyList.length; i++) {
			playerObj.hp -= this.currentEnemyList[i].attack;
			//if the player dies
			if (playerObj.hp <= 0) {
				//death message
				currentBiome = "death";
				this.exitBattleScene();
			}
		}
	}
	
	refreshExpBar() {
		this.tempNum = playerObj.neededExp;
		while (playerObj.currentExp >= this.tempNum) {
			//lvl up and gain points
			this.levelUpPlayer();
			//add leftover exp
			playerObj.currentExp -= playerObj.neededExp;
			//scale needed exp
			playerObj.neededExp *= playerObj.scaleExp;
			//refreshes to the new value
			this.tempNum = playerObj.neededExp;
		}
		
		this.graphicsBgExp.clear();
		this.graphicsBgExp.fillStyle(0x00FFFF, 1.0);
		this.graphicsBgExp.fillRect(
			this.gameWidth1pc,
			this.gameHeight60pc - this.gameWidth1pc - 20,
			(playerObj.currentExp * (gameObj.config.width - this.gameWidth1pc - this.gameWidth1pc)) / playerObj.neededExp,  //% of the lenght 
			20);
		this.lvlNum.setText("Lvl : " + playerObj.lvl);
	}
	
	levelUpPlayer() {
		playerObj.lvl++;
		// playerObj.maxHp *= playerObj.scaleExp;
		playerObj.maxHp += 20;
		playerObj.attack += 10;
	}
	
	refreshHpBar() {
		//update player hp bar
		this.graphicsHpBar.clear();
		this.graphicsHpBar.fillStyle(0xff0000,1);
		this.graphicsHpBar.fillRect(0, 10,(playerObj.hp * 200) / playerObj.maxHp,30);
		//update the player hp text
		this.hpBarNum.setText("Hp: " + playerObj.hp + "/" + playerObj.maxHp);
		if (playerObj.hp <= 0) {
			this.hpBarNum.setText("Hp: 0" + "/" + playerObj.maxHp);
		}
		//update enemy hp bar
		this.graphicsEHpBar.clear();
		this.graphicsEHpBar.fillStyle(0xff0000,1);
		if (this.currentEnemyList.length != 0) {
			this.graphicsEHpBar.fillRect(gameObj.config.width -200,10,(this.currentEnemyList[0].hp*200)/this.currentEnemyList[0].maxHp,30);
			//update the enemy hp text
			this.hpBarENum.setText("Hp: " + this.currentEnemyList[0].hp + "/" + this.currentEnemyList[0].maxHp );
		} else {
			this.graphicsEHpBar.fillRect(gameObj.config.width -200,10,0/200,30);
			for (var i = 0; i < allEnemies.length; i++) {
				if (allEnemies[i].biome == currentBiome && allEnemies[i].type == currentEnemyType) {
					this.hpBarENum.setText("Hp: 0" + "/" + allEnemies[i].maxHp);
				}
			}
		}
	}
	
	updateNewBattleScene() {
		//resetting variables
		console.log("update started");

		this.selectedLeftSide = 0; 
		this.selectedRightSide = 0;
		this.activeMenuLeftSideTexts = [];
		this.activeMenuRightSideTextsR = [];
		this.isMainMenuHasActive = false;
		this.refreshExpBar();
		//place currenly used enemies in an array
		this.currentEnemyList = [];
		this.currentEnemyList = this.enemySelector();
		console.log(allEnemies);
		this.refreshHpBar();
		console.log(this.currentEnemyList);
		// puts down currentEnemyList's enemy objects into their location and start animation
		this.spawnEnemy(); 
		//print out the main menu
		this.listMenu(this.mainBattleMenu, true, this.styleBasicWhite);

	}
	
	changeBackground(){
	this.fillStyleBackground = "0xFF00FF";
        switch (currentBiome) {
            case "nature" :
				this.fillStyleBackground = "0x72E572";
				break;
            case "ice" : 
				this.fillStyleBackground = "0x9999FF";
				break;
            case "fire" : 
				this.fillStyleBackground = "0x900000";
				break;
            case "desert" : 
				this.fillStyleBackground = "0xD6B26F";
				break;
        }
        this.graphicsBackground=this.add.graphics();
        this.graphicsBackground.fillStyle(this.fillStyleBackground, 1.0);
        this.graphicsBackground.fillRect(0,0,gameObj.config.width,this.gameHeight60pc);
	}
			
	exitBattleScene() {
		//only EXIT
		//everything being resetted upon starting it again
		isItNew = true;
		this.input.keyboard.enabled = true;
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
		}
		
	}
}