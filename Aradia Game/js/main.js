/** @type {import("../typings/phaser")} */
//importing typings for editing purposes
var gameObj; // the global game object
var currentEnemyType = ""; //object type of the enemy
var currentBiome = ""; //the biomeScene that the player is in
var isItNew = true; //do we have a new battlescene

//the player object
var playerObj = {
	"playerSpeed" : 500,
	"playerX" : 0,
	"playerY" : 0,
	"maxHp": 100,
	"hp": 100,
	"attack": 20,
	"lvl" : 1,
	"currentExp" : 0,
	"neededExp" : 300,
	"scaleExp" : 1.20,
	"gold" : 50,
	"inventory" : ['Starter Hp Potion']
}

var spiderNObj = {
	"biome" : "nature",
	"type" : "spider",
	"name" : "Mr. Spi-deer",
	"maxHp": 50,
	"hp" : 50,
	"attack" : 10,
	"spriteKey" : "spiderNKey",
	"animKey" : "spiderNAnimation",
	"animDeathKey" : "spiderNDeathAnimation",
	"exp" : 100,
	"gold" : 5
}

var spiderDObj = {
	"biome" : "desert",
	"type" : "spider",
	"name" : "Alfred",
	"maxHp": 80,
	"hp" : 80,
	"attack" : 25,
	"spriteKey" : "spiderDKey",
	"animKey" : "spiderDAnimation",
	"animDeathKey" : "spiderDDeathAnimation",
	"exp" : 200,
	"gold" : 10
}

var spiderIObj = {
	"biome" : "ice",
	"type" : "spider",
	"name" : "Leg-olas Icicles",
	"maxHp": 100,
	"hp" : 100,
	"attack" : 40,
	"spriteKey" : "spiderIKey",
	"animKey" : "spiderIAnimation",
	"animDeathKey" : "spiderIDeathAnimation",
	"exp" : 300,
	"gold" : 15
}

var spiderFObj = {
	"biome" : "fire",
	"type" : "spider",
	"name" : "Goliath Redmane",
	"maxHp": 200,
	"hp" : 200,
	"attack" : 60,
	"spriteKey" : "spiderFKey",
	"animKey" : "spiderFAnimation",
	"animDeathKey" : "spiderFDeathAnimation",
	"exp" : 550,
	"gold" : 40
}
//array of enemies
var allEnemies = [
	spiderNObj,
	spiderDObj,
	spiderIObj,
	spiderFObj		
]

window.onload=function()
{
	var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 800,
		backgroundColor: 0x4c4c4c,
        parent: 'phaser-game',
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				debug: false
			}
		},
        scene: [SceneIntro, SceneCity, SceneBattle, SceneNature, SceneDesert, SceneIce, SceneFire, SceneDeath, SceneMap]
    };
	//instantiating the game object
	gameObj = new Phaser.Game(config);
}