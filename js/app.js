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
    // [85, 135]
    this.speed = 85 + Math.random() * 50;
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
      this.x = this.initX;
    }
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
    var step = 20;
    var x = this.x, y = this.y;
    switch (direction) {
      case 'up':
        y -= step;
        break;
      case 'right':
        x += step;
        break;
      case 'down':
        y += step;
        break;
      case 'left':
        x -= step;
        break;
    }
    // TODO: check bounds
    this.x = x;
    this.y = y;
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
