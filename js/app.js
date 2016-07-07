(function(global) {
  'use strict';

  var ScreenObject = function() {};
  // Draw the object on the screen, required method for game
  ScreenObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
  ScreenObject.prototype.update = function() {};

  // Enemies our player must avoid
  var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.initX = -100;
    this.x = this.initX;
    this.y = 60;
    this.initSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
  };
  Enemy.prototype = Object.create(ScreenObject.prototype);

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > ctx.canvas.width) {
      // start from beginning
      this.x = this.initX;
      // random speed
      this.initSpeed();
    }
  };

  Enemy.prototype.initSpeed = function() {
    // [150, 300]
    this.speed = 150 + Math.random() * 200;
  };

  // Player class has an update(), render() and
  // a handleInput() method.
  var Player = function() {
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
  };
  Player.prototype = Object.create(ScreenObject.prototype);

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
      this.x = x;
      this.y = y;
    }
  };

  Player.prototype.checkBounds = function(x, y) {
    var maxWidth = ctx.canvas.width - 50;
    var maxHeight = ctx.canvas.height - 150;
    if (x < 0 || y < -10 || x > maxWidth || y > maxHeight) {
      return false;
    }
    return true;
  };

  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player
  var player = new Player();
  var allEnemies = [new Enemy()];

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
    player: player
  };
})(this);
