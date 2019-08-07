//In the initial section here variables are all initialized. 

let counter = 100;
let bossCounter = 500;
let inGameTime = 0;
let hit = false;
let isKeyDown = false;
let side = "none";

let player;
let pillar_1;
let end = false;
let attackRange = false;
let projectileShot = false;

//These are the arrays which I will use later to push information into the local storage
//Update health, and keep track of other information. 

let character = [{
    name: "Edgar",
    health: counter,
    type: "Soldier"
}];
let bossArray = [{
    name: "Lotheran",
    health: bossCounter,
    type: "Boss"
}];
let deathCount = [{
    characterName: character[0].name,
    downCount: 0,
    killCount: 0
}];

//These variables are used to help with movement controls. 

let
    up = false,
    right = false,
    down = false,
    left = false,
    hit1 = false,
    collide = false;
x = window.innerWidth / 2 - 130 / 2,
    y = window.innerHeight / 2 - 130 / 2;

//Audio Files are called here and assigned to variable. 

let prologueTrack = new Audio('public/audio/True_Art_Real_Affection.mp3'),
    swordSwing_1 = new Audio('public/audio/sword_1.wav'),
    boss_Swing_1 = new Audio('public/audio/boss_Swing_1.mp3'),
    projectile_1 = new Audio('public/audio/projectile_1.mp3'),
    parry_1 = new Audio('public/audio/parry_1.mp3');

//Local storage is created for the objects created earlier.

if (window.localStorage.length != 0) {
    window.localStorage.setItem('character', JSON.stringify(character));
}
if (window.localStorage.length != 0) {
    window.localStorage.setItem('boss', JSON.stringify(bossArray));
}
if (window.localStorage.length != 0) {
    window.localStorage.setItem("deathCount", JSON.stringify(deathCount));
}
//Loads the Game, Creates Components and Initiates Relavent Functions
//Code for the game loop was borrowed from here. 
// /https://idiallo.com/blog/javascript-game-state-stack-engine
let Game = {
    // Canvas to draw on
    canvas_width: 900,
    canvas_height: 600,
    canvasElement: null,
    canvas: null,

    // The game loop
    FPS: 60,
    timer: null,
    timerID: null, // interval


    gameMode: new StateStack(),

    update: function () {
        this.gameMode.update();
        this.gameMode.render();
    },


    startGame: function () {
        this.gameMode.push(new MainMenuState());
        this.timerID = setInterval(this.update.bind(this), this.timer);

    },

    pauseGame: function () {
        clearInterval(this.timerID);
    },

    resumeGame: function () {
        this.timerID = setInterval(this.update.bind(this), this.timer);
    },
    /**
     * Initialize the canvas to the page
     */
    setupCanvas: function (wrapper) {
        this.canvasElement = document.createElement("canvas");
        this.canvasElement.width = this.canvas_width;
        this.canvasElement.height = this.canvas_height;
        this.canvas = this.canvasElement.getContext("2d");

        wrapper.appendChild(this.canvasElement);
    },

    init: function () {
        this.setupCanvas(document.getElementById("main_window"));
        this.timer = 1000 / this.FPS;
        this.startGame();
    },
}
//This determines the functionality of each Game State. 
window.onload = function () {
    window.getGameInstance = function () {
        return Game.gameMode;
    };

    window.getCanvas = function () {
        return Game.canvas;
    };

    window.getGameDimensions = function () {
        return {
            width: Game.canvas_width,
            height: Game.canvas_height
        };
    };

    window.pauseGame = function () {
        Game.gameMode.pause();
        Game.pauseGame();
    };

    window.resumeGame = function () {
        Game.resumeGame();
        Game.gameMode.resume();
    };

    window.getCanvasElement = function () {
        return Game.canvasElement;
    };

    Game.init();
};
// MainMenuState.js
let MainMenuState = function () {
    this.name = "MainMenuState";
    //Some of the code you will see was originally part of a game loop I created.
    //Had I initially created the Game State Engine I would have programmed it very differently. 

    //Canvas is created here 

    let canvas = getCanvas(),
        dimensions = getGameDimensions(),
        backgroundColor = "#000",
        textColor = "rgb(0,0,0)", // Starts with black
        colorsArray = [], // our fade values
        colorIndex = 0;

    //This determines what happens when the game state is started. 

    this.onEnter = function () {
        let i = 1,
            l = 100,
            values = [];
        for (; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        colorsArray = values;
        // When the Space Bar is pressed go to the next state
        window.onkeydown = function (e) {
            let keyCode = e.keyCode;
            if (keyCode === 13) {
                // Go to next State
                let gameMode = getGameInstance();
                canvas.clearRect(0, 0, dimensions.width, dimensions.height);
                gameMode.push(new Prologue());
                console.log(gameMode)
                /** Note that this does not remove the current state
                 *  from the list. it just adds Level1State on top of it.
                 */
            }
        };
    };
    this.onExit = function () {
        // clear the keydown event
        window.onkeydown = null;
    };

    this.update = function () {
        // update values
        if (colorIndex == colorsArray.length) {
            colorIndex = 0;
        }
        textColor = "rgb(" + colorsArray[colorIndex] + "," + colorsArray[colorIndex] + "," + colorsArray[colorIndex] + ")";
        colorIndex++;
    };

    this.render = function () {
        // redraw
        canvas.clearRect(0, 0, dimensions.width, dimensions.height)
        canvas.beginPath();
        canvas.fillStyle = backgroundColor;
        canvas.fillColor = backgroundColor;
        canvas.fillRect(0, 0, dimensions.width, dimensions.height);
        canvas.fillStyle = textColor;
        canvas.font = "24pt Courier";
        canvas.fillText('Press Enter To Start', 220, 300);
    };
};
//Creates Canvas and defines Keydown and Up Events 

const bg1 = new Image();
bg1.src = 'public/images/lost_Suns_BG_1_Cropped.png';

let keyMap = {};

//These are Lodash throttle functions which call a function once every x seconds. 

const pAtkDebounced = _.throttle(playerAttack, 1000, { //player Attack
    'trailing': false
});
const rollDebounced = _.throttle(roll, 1000, { //player Roll
    'trailing': false
});
const bAtkDebounced = _.throttle(damage, 3000, { //boss Attack 
    'trailing': false
});
const plProjDebounced = _.throttle(playerProjectile, 2000, { //player projectile 
    'trailing': false
});

//Defines the components to be used in the Game
function component(width, height, color, x, y) {
    canvas = getCanvas();
    dimensions = getGameDimensions();
    this.gamearea = canvas;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function () {
        canvas.fillStyle = color;
        canvas.fillRect(this.x, this.y, this.width, this.height);

    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}
//This is the actual game, and as stated above reminiscent of my original game loop. 

let Prologue = function startGame() {
    this.name = "Prologue";

    //Here is where all components are created. These are custom canvas objects. 

    player = new component(30, 30, "red", 10, 120);
    boss = new component(30, 40, "blue", 100, 120);
    chest = new component(20, 40, "purple", 700, 200);
    bullet = new component(10, 10, "white", 1000, 1000);
    pillar_1 = new component(120, 130, "purple", 440, 440);
    pillar_2 = new component(130, 90, "purple", 140, 280);

    //This is used to call various functions in the game. 
    inGameClockHidden();
    //Perform Ajax Call For Game Loot
    makeRequest("game_Test_Loot.xml");
    // initialize the JSON array
    lootTable = new Array();

    this.update = function () {
        canvas = getCanvas();
        dimensions = getGameDimensions();
        canvas.clearRect(0, 0, dimensions.width, dimensions.height);
    };

    this.onEnter = function () {

        //Canvas is cleared, music starts, keydown and keyup are initialized. 
        canvas = getCanvas();
        dimensions = getGameDimensions();
        prologueTrack.play();
        window.addEventListener('keydown', function (e) {
            canvas.key = e.keyCode;
            keyMap[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            canvas.key = true;
            delete keyMap[e.keyCode];
        })
        Game.canvas.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        canvas = getCanvas();
        dimensions = getGameDimensions();
        canvas.clearRect(0, 0, dimensions.width, dimensions.height);

    };

    //This is where all canvas objects are redrawn after the canvas is cleared.

    this.render = function () {
        canvas = getCanvas();
        dimensions = getGameDimensions();
        pillar_1.update();
        pillar_1.newPos();
        pillar_2.update();
        pillar_2.newPos();

        canvas.drawImage(bg1, 0, 0, dimensions.width, dimensions.height);

        boss.newPos();
        boss.update();
        bullet.newPos();
        bullet.update();
        player.newPos();
        player.update();

        chest.update();
        chest.newPos();
        player.speedX = 0;
        player.speedY = 0;
        boss.speedX = 0;
        boss.speedY = 0;

        distance(player, boss);
        distance(player, pillar_1);
        distance(player, pillar_2);
        chestDistance(player, chest);
        aiDistance(boss, pillar_1);
        aiDistance(boss, chest);
        aiDistance(boss, pillar_2);
        projDistance(boss, bullet);
        nearbyMob(player, boss);
        bAtkDebounced(attackRange);

        //This is a key array which looks to see if X key is in a map. If it is the code 
        //related to it is run. This allows for multiple key presses. 

        if (65 in keyMap) { //A - Left

            player.speedX = -2;
            if (side == 'right') {
                player.speedX = 0;
            }
        }
        if (68 in keyMap) { //D - Right
            player.speedX = 2;
            if (side == 'left') {
                player.speedX = 0;
            }
        }
        if (87 in keyMap) //S - Down
        {
            player.speedY = -2;
            if (side == 'bottom') {
                player.speedY = 0;
            }
        }
        if (83 in keyMap) // w - Up
        {
            player.speedY = 2;
            if (side == 'top') {
                player.speedY = 0;
            }
        }
        if (16 in keyMap) //Shift - Projectile
        {
            plProjDebounced();
        }
        if (32 in keyMap) // Space Bar - Attack  
        {
            pAtkDebounced(attackRange);
        }
        if (side = 'left' || (side = 'right')) {
            if (Math.abs(boss.speedX) > 0) {
                boss.speedX = 0;
            }
        }
        if (side = 'top' || (side = 'bottom')) {
            if (Math.abs(boss.speedY) > 0) {
                boss.speedY = 0;
            }
        }
        if (side = 'none') {
            nearbyMob(player, boss);
        }
        //These check to see if the player or boss is still alive during each game loop.
        death();
        bossDeath();
        boss.update();

        //sets collison equal to none so that the character can move after hitting an object.
        side = "none";
    };
    this.onExit = function () {}
}

//Loads file from XML via AJAX request
let xhr;

function makeRequest(url) {
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xhr) {
        xhr.onreadystatechange = loadXMLLoot;
        xhr.open("GET", url, true);
        xhr.send(null);
    } else {
        console.log("Sorry, couldn't create an XMLHttpRequest");
    }
}
//Loads XML Data to Game
function loadXMLLoot() {

    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            // get all the song elements
            let allLoot = xhr.responseXML.getElementsByTagName("loot");
            for (let i = 0; i < allLoot.length; i++) {
                let name =
                    allLoot[i].getElementsByTagName("name")[0].textContent;
                let type =
                    allLoot[i].getElementsByTagName("type")[0].textContent;
                let buff =
                    allLoot[i].getElementsByTagName("buff")[0].textContent;
                let debuff =
                    allLoot[i].getElementsByTagName("debuff")[0].textContent;

                // create a new JSON object for each person
                let newLoot = {
                    "name": name,
                    "type": type,
                    "buff": buff,
                    "debuff": debuff,
                    "looted": false,
                    "equipped": false
                };
                // add the object to the array
                lootTable.push(newLoot);
                window.localStorage.setItem('loot', JSON.stringify(newLoot));
                console.log(lootTable);
            }
        }
    }
}
// Web Worker - I Wanted to incorperate something a little better like checking for collision 
//Through the web worker, however due to time constraints I kept it simple. This worker simply 
//checks if you have been attacked initially and then dies. 

function startWorker() {
    if (typeof (Worker) !== "undefined") {
        if (typeof (w) == "undefined") {
            w = new Worker('javascript/damageWorker.js');
            w.addEventListener("message", handleReceipt, false);
            w.postMessage(engageDetect)
        }
    }
}

function handleReceipt(event) {
    let data = event.data;
    console.log('Message recieved from worker ' + data);
    w.terminate();
}

//This is code I still want to work on. At the moment it functions as a knockback when you parry. 
//This is sort of an "Animation" in a sense. 

function roll() {
    console.log("Roll");
    if (player.speedX > 0) {
        player.speedX *= 5;
        player.x += 25;
    }
    if (player.speedX < 0) {
        player.speedX *= 5;
        player.x -= 25;
    }
    if (player.speedY > 0) {
        player.speedX *= 5;
        player.y += 25;
    }
    if (player.speedY < 0) {
        player.speedX *= 5;
        player.y -= 25;
    }
}

//checks the distance between two components. I seperated the distance check 
//to make this easier however I would like to find another way to check any object 
//with one function. 

function distance(r1, r2) {
    if (r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y) {
        collision(r1, r2);
    }
    return true;
}

function aiDistance(r1, r2) {
    if (r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y) {}
    return true;
}

function chestDistance(r1, r2) {
    if (r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y) {
        collision(r1, r2);
        allowLoot(side);
    }
    return true;
}

//This is another distance check followed by damage due to projectile hit.
//This check differs in that it doesn't matter where collision happens - only that 
//it hits exactly on the component. 

function projDistance(r1, r2) {
    if (r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y) {
        bossArray[0].health -= 10;
        console.log(bossArray);
        window.localStorage.setItem('boss', JSON.stringify(bossArray));
        return true;
    }
}

//This is the collision detection. At the moment it only works for one object at a time. 
//After object distance is checked it determines which side was hit and then outputs it as a variable. 

function collision(r1, r2) {
    let dx = (r1.x + r1.width / 2) - (r2.x + r2.width / 2);
    let dy = (r1.y + r1.height / 2) - (r2.y + r2.height / 2);
    let width = (r1.width + r2.width) / 2;
    let height = (r1.height + r2.height) / 2;
    let crossWidth = width * dy;
    let crossHeight = height * dx;
    let collision = 'none';
    //
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        } else {
            collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
        }
    }
    side = collision;
    return (collision);
}

//This is the inGameCounter mentioned earlier. It simple counts upward.
function inGameClockHidden() {
    setInterval(function () {
        inGameTime++;
        console.log(inGameTime);
    }, 1000)
}

//This probably doesn't need to be asynchronous however I wanted to try and incorporate this as 
//a web worker and figured this might help. Ultimately I couldn't set the player health to the returned counter 
//value. 
//This basically checks in the player is in attack range - a smaller distance that the distance() function checks for 
//If they are, and its been three seconds then the boss attacks. If the player his shift at the same time as the boss attack 
//The player parrys 

async function damage(bossAttackRange) {

    if (bossAttackRange == true) {
        if (16 in keyMap) {
            parry_1.play();
            rollDebounced();
        } else {

            damage = (Math.floor(Math.random() * 30) + 10);
            engageDetect = damage;
            startWorker();
            character[0].health -= damage;
            boss_Swing_1.play();
            console.log(character[0].health);
            window.localStorage.setItem('character', JSON.stringify(character));

        }
    }
}

//This is called when the player distance is close to the a chest item. I would probably use 
//an object type property to determine distance between objects in the future, and say if Item.type= chest{ allowLoot()}
//Thus function checks for collision with a chest and says that if you on the on the chests left side, than the lootable options appear. 
//if you loot the item will say looted = true, and the buttons dissapear. 

function allowLoot(side) {
    if (side == 'left') {
        canvas = getCanvas(),
            dimensions = getGameDimensions();
        document.getElementById('loot').style = "visbility:visible";
        document.getElementById('endLoot').style = "visbility:visible";
        canvas.font = "30px Arial";
        canvas.fillText("Pick Up Item?", 10, 50);
    }
    if (side == 'none') {
        document.getElementById('loot').style = "visbility:none";
        document.getElementById('endLoot').style = "visbility:none";
    }
}

//This is the lootTable array, how it is called and stored. 

function loot() {
    this.itemDrop = lootTable;
    document.getElementById('loot').style = "display:none";
    document.getElementById('endLoot').style = "display:none";

    if (lootTable.looted !== true) {
        let itemDrop = lootTable[Math.floor(Math.random() * lootTable.length)];
        itemDrop.looted = true;
        window.localStorage.setItem(lootTable.name, JSON.stringify(lootTable));
        character.push(itemDrop);
        window.localStorage.setItem('loot', JSON.stringify(lootTable));

        console.log(character);
    } else {
        console.log("You looted everything");
        return;
    }
}

function endLoot() {
    document.getElementById('loot').style = "display:none";
    document.getElementById('endLoot').style = "display:none";
    console.log("End Loot");
}

//This is only for enemies. It checks for a further distance than distance(). 
//If player, the mob follows the player. If the player is in attack range it sets the value to true,
//If not the mob will went in a triangular pattern until in range. 

function nearbyMob(r1, r2) {
    let i = inGameTime;

    if (r1.x < r2.x + r2.width + 200 &&
        r1.x + 200 + r1.width > r2.x &&
        r1.y < r2.y + 200 + r2.height &&
        r1.y + r1.height + 200 > r2.y) {

        moveToPlayer(r1, r2);
    }
    if (r1.x < r2.x + r2.width + 30 &&
        r1.x + 30 + r1.width > r2.x &&
        r1.y < r2.y + 30 + r2.height &&
        r1.y + r1.height + 30 > r2.y) {

        attackRange = true;
    } else {

        attackRange = false;

        if ((Number.isInteger(i / 2))) {
            boss.speedX = -1;
        }
        if ((Number.isInteger(i / 5))) {
            if (Number.isInteger(i / 2)) {
                boss.speedY = 1;
            } else {
                boss.speedY = -1;
            }
        }
        if (((Number.isInteger(i / 3)))) {
            boss.speedX = 1;
        } {

        }
    }
}

//This simply gets the player coordinates.

function moveToPlayer(r1, r2) {
    getPlayerX();
    getPlayerY();

    function getPlayerX() {
        if (r2.x > r1.x) {
            for (i = r2.x; i > r1.x + r1.width; i--) {
                r2.speedX = -1;
            }
        }
        if (r2.x < r1.x) {
            for (i = r2.x; i < r1.x + r1.width; i++) {
                r2.speedX = 1;
            }
        }
    }

    function getPlayerY() {
        if (r2.y > r1.y) {
            for (n = r2.y; n > r1.y + r1.height; n--) {
                r2.speedY = -1;
            }
        }
        if (r2.y < r1.y) {
            for (n = r2.y; n < r1.y + r1.height; n++) {
                r2.speedY = 1;
            }
        }
    }
}

//This determines player attack and damage when player is in range of Boss. 

function playerAttack(playerAttackRange) {
    if (playerAttackRange == true) {
        bossArray[0].health -= 30;
        swordSwing_1.play();
        console.log(bossArray);
        window.localStorage.setItem('boss', JSON.stringify(bossArray));
    }
}

//When the boss dies the new state is called, and the local storage updated. This also 
//happens whenthe player dies as seen in the function below. 

function bossDeath() {
    if (bossArray[0].health < 1) {
        deathCount[0].killCount += 1;
        console.log('Boss Has Been Killed');
        window.localStorage.setItem('boss', JSON.stringify(bossArray));
        window.localStorage.setItem("deathCount", JSON.stringify(deathCount));
        let gameMode = getGameInstance();
        gameMode.push(new KillScreen());
    }
}

function death() {
    if (character[0].health < 0) {
        deathCount[0].downCount += 1;
        window.localStorage.setItem("deathCount", JSON.stringify(deathCount));
        let gameMode = getGameInstance();
        gameMode.push(new KillScreen());
    }
}

//This has the bullet object follow the player and whenever the play hits a direction 
//and shift it shoots the bullet in that direction. I would probably try to find a way to 
//create an object on keydown if I did this again. 

function playerProjectile() {
    if (bullet.x != player.x || (bullet.y != player.y)) {
        bullet.x = player.x;
        bullet.y = player.y;
    }
    if (65 in keyMap) {
        bullet.speedX = -5;
        bullet.speedY = 0;
        projectile_1.play();
    }
    if (68 in keyMap) {
        bullet.speedX = 5;
        bullet.speedY = 0;
        projectile_1.play();
    }
    if (87 in keyMap) {
        bullet.speedX = 0;
        bullet.speedY = -5;
        projectile_1.play();
    }
    if (83 in keyMap) {
        bullet.speedX = 0;
        bullet.speedY = 5;

    }
}

//Final gameState. Very Simple screen that states how many kills and deaths the player has. 
let KillScreen = function () {
    this.name = "KillScreen";

    canvas = getCanvas(),
        dimensions = getGameDimensions(),
        backgroundColor = "#000",
        textColor = "rgb(0,0,0)", // Starts with black
        colorsArray = [], // our fade values
        colorIndex = 0;

    this.onEnter = function () {
        let i = 1,
            l = 100,
            values = [];
        for (; i <= l; i++) {
            values.push(Math.round(Math.sin(Math.PI * i / 100) * 255));
        }
        colorsArray = values;
        console.log(StateStack);
        counter = 100;
        bossCounter = 500;
        character[0].health = 100;
        bossArray[0].health = 500;
    }
    this.onExit = function () {
        // clear the keydown event
        window.onkeydown = null;
    };

    this.update = function () {
        // update values
        if (colorIndex == colorsArray.length) {
            colorIndex = 0;
        }
        textColor = "rgb(" + colorsArray[colorIndex] + "," + colorsArray[colorIndex] + "," + colorsArray[colorIndex] + ")";
        colorIndex++;
    };

    this.render = function () {
        // redraw
        canvas.clearRect(0, 0, dimensions.width, dimensions.height);
        canvas.beginPath();
        canvas.fillStyle = backgroundColor;
        canvas.fillColor = backgroundColor;
        canvas.fillRect(0, 0, dimensions.width, dimensions.height);
        canvas.fillStyle = textColor;
        canvas.font = "24pt Courier";
        canvas.fillText('Deaths:' + " " + deathCount[0].downCount, 330, 300);
        canvas.fillText('Kills:' + " " + deathCount[0].killCount, 330, 350);
    };
};