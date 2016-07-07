(function(global) {
  'use strict';

  // change to true to see the boundaries of the objects
  var debug = true;

  // We do not want inherit Player from Enemy, as Player is not Enemy.
  // So this is the base class for all objects we add on the screen
  var ScreenObject = function() {};

  ScreenObject.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
    this.initBox();
  };

  ScreenObject.prototype.initBox = function() {
    this.box = {
      x: this.x,
      y: this.y,
      w: 50,
      h: 50
    };
  };

  // Draw the object on the screen, required method for game
  ScreenObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (debug) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);
    }
  };
  ScreenObject.prototype.update = function() {};

  // Enemies our player must avoid
  var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.initX = -100;
    // this.initY = 62;
    // this.initY = 146;
    // this.initY = 230;
    this.reset();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
  };
  Enemy.prototype = Object.create(ScreenObject.prototype);

  Enemy.prototype.initBox = function() {
    this.box = {
      x: this.x,
      y: this.y + 77,
      w: 100,
      h: 65
    };
  };

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var x = this.x + this.speed * dt;
    this.setPos(x, this.y);
    if (this.x > ctx.canvas.width) {
      this.reset();
    }
  };

  Enemy.prototype.reset = function() {
    var LANES = [62, 146, 230];
    // [0, 2]
    var lane = Math.floor(Math.random() * 3);
    var y = LANES[lane];
    this.setPos(this.initX, y);
    this.initSpeed();
  };

  Enemy.prototype.initSpeed = function() {
    // [150, 350]
    this.speed = 150 + Math.random() * 200;
  };

  Enemy.prototype.checkCollision = function(player) {
    var rect1 = player.box;
    var rect2 = this.box;
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
      return true;
    }
    return false;
  };

  // Player class has an update(), render() and
  // a handleInput() method.
  var Player = function() {
    this.initX = 200;
    this.initY = 400;
    this.reset();
    this.sprite = 'images/char-boy.png';
  };
  Player.prototype = Object.create(ScreenObject.prototype);

  Player.prototype.initBox = function() {
    this.box = {
      x: this.x + 16,
      y: this.y + 65,
      w: 69,
      h: 75
    };
  };

  Player.prototype.handleInput = function(direction) {
    var STEP_X = 100;
    var STEP_Y = 82;
    var x = this.x, y = this.y;
    switch (direction) {
      case 'up':
        y -= STEP_Y;
        break;
      case 'right':
        x += STEP_X;
        break;
      case 'down':
        y += STEP_Y;
        break;
      case 'left':
        x -= STEP_X;
        break;
    }
    if (this.checkBounds(x, y)) {
      this.setPos(x, y);
    }
  };

  Player.prototype.checkWin = function() {
    return this.y < 50;
  };

  Player.prototype.checkBounds = function(x, y) {
    var maxWidth = ctx.canvas.width - 50;
    var maxHeight = ctx.canvas.height - 150;
    if (x < 0 || y < -10 || x > maxWidth || y > maxHeight) {
      return false;
    }
    return true;
  };

  Player.prototype.reset = function() {
    this.setPos(this.initX, this.initY);
  };

  var Score = function() {
    this.value = 0;
  };

  Score.prototype.update = function(dt) {
    if (player.y < 300) {
      this.value += 1 * dt;
    } else {
      this.value -= 1 * dt;
    }
  };

  Score.prototype.render = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 600, 50);
    ctx.font = '36px Impact';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    var x = 5, y = 40;
    var txt = 'SCORE: ' + Math.round(this.value);
    ctx.strokeText(txt, x, y);
    ctx.fillText(txt, x, y);
  };

  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player
  var player = new Player();
  var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
  var score = new Score();

  // This listens for key presses and sends the keys to your
  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  });

  global.Game = {
    allEnemies: allEnemies,
    player: player,
    score: score
  };
})(this);
