(function(global) {
  'use strict';

  // change to true to see the boundaries of the objects
  var debug = true;

  // We do not want inherit Player from Enemy, as Player is not Enemy.
  // So this is the base class for all objects we add on the screen
  var ScreenObject = function() {};

  // Sets the x and y values for the object and rebuild box coordinates
  ScreenObject.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
    this.initBox();
  };

  // Rebuilds box coordinates for the object that are used for collision
  // and for debug
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

  // Checks if given Screen Object box intersects with this Screen Object box
  ScreenObject.prototype.checkCollision = function(object) {
    var rect1 = object.box;
    var rect2 = this.box;
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
      return true;
    }
    return false;
  };

  ScreenObject.prototype.update = function() {};

  var Gem = function() {
    this.width = 0;
    this.height = 0;
    this.setPos(0, 0);
    this.sprite = 'images/Gem Orange.png';
  };
  Gem.prototype = Object.create(ScreenObject.prototype);

  Gem.prototype.render = function() {
    if (this.isVisible) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width,
          this.height);
      if (debug) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);
      }
    }
  };

  Gem.prototype.initBox = function() {
    this.box = {
      x: this.x,
      y: this.y + 30,
      w: 50,
      h: 50
    };
  };

  Gem.prototype.hide = function() {
    if (this.transformTimer) {
      clearTimeout(this.transformTimer);
    }
    this.isVisible = false;
    setTimeout(this.reset.bind(this), 10000);
  };

  Gem.prototype.reset = function() {
    var COLUMNS = [25, 126, 227, 328, 430];
    var LANES = [120, 204, 284];
    this.isVisible = true;
    this.value = 15;
    this.sprite = 'images/Gem Orange.png';
    // [0, 4]
    var column = Math.floor(Math.random() * 5);
    var x = COLUMNS[column];
    // [0, 2]
    var lane = Math.floor(Math.random() * 3);
    var y = LANES[lane];
    this.width = 50;
    this.height = 85;
    this.setPos(x, y);
    this.transformTimer = setTimeout(this.transform.bind(this), 10000);
  };

  // after gem is appeared, in 10 seconds it is transformed to the next stage
  Gem.prototype.transform = function() {
    if (this.sprite.toLowerCase().indexOf('orange') !== -1) {
      this.sprite = 'images/Gem Blue.png';
      this.value = 10;
      this.transformTimer = setTimeout(this.transform.bind(this), 10000);
    } else if (this.sprite.toLowerCase().indexOf('blue') !== -1) {
      this.sprite = 'images/Gem Green.png';
      this.value = 5;
      this.transformTimer = setTimeout(this.hide.bind(this), 10000);
    }
  };

  // Enemies our player must avoid
  var Enemy = function(baseSpeed) {
    this.baseSpeed = baseSpeed;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.initX = -100;
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
    this.speed = this.baseSpeed + Math.random() * 200;
  };

  // Player class has an update(), render() and
  // a handleInput() method.
  var Player = function() {
    this.initX = 200;
    this.initY = 400;
    this.reset();
    this.sprite = 'images/char-boy.png';
    this.health = 5;
    this.healthSprite = 'images/Heart.png';
  };
  Player.prototype = Object.create(ScreenObject.prototype);

  Player.prototype.render = function() {
    ScreenObject.prototype.render.call(this);
    // remove previous hearts
    ctx.fillStyle = 'white';
    ctx.fillRect(300, 0, 600, 50);
    for (var i = 0; i < this.health; ++i) {
      ctx.drawImage(Resources.get(this.healthSprite), 470 - i * 30, 0, 33, 56);
    }
  };

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
    var $img = $('img', '.selected');
    this.sprite = $img.attr('src');
    this.setPos(this.initX, this.initY);
  };

  Player.prototype.win = function() {
    this.reset();
    this.health = 5;
    if (score.value >= 50) {
      var level = getLevel();
      var maxLevel = localStorage.getItem('maxLevel');
      maxLevel = Math.max(level + 1, maxLevel);
      localStorage.setItem('maxLevel', maxLevel);
    }
    score.value = 0;
  };

  Player.prototype.wasted = function() {
    this.reset();
    this.health--;
    if (this.health === 0) {
      this.health = 5;
      score.value = 0;
      textBoard.showText('Game Over!');
    } else {
      textBoard.showText('wasted!');
    }

  };

  Player.prototype.onGemCaptured = function(gem) {
    if (gem.isVisible) {
      gem.hide();
      score.value += gem.value;
    }
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
    ctx.fillRect(0, 0, 300, 50);
    ctx.font = '36px Impact';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    var x = 5, y = 40;
    var txt = 'SCORE: ' + Math.round(this.value);
    ctx.strokeText(txt, x, y);
    ctx.fillText(txt, x, y);
  };

  // Class for showing different text messages on the screen
  var TextBoard = function() {};
  TextBoard.prototype.render = function() {
    if (this.txt) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black';
      ctx.font = '46px Impact';
      ctx.fillStyle = 'white';
      ctx.strokeText(this.txt, this.x, this.y);
      ctx.fillText(this.txt, this.x, this.y);
    }
  };

  TextBoard.prototype.showText = function(txt, x, y) {
    this.txt = txt.toUpperCase();
    var that = this;
    this.x = x || 160;
    this.y = y || 300;
    setTimeout(function() {
      that.txt = '';
    }, 3000);
  };

  // On Canvas click handler
  // This is done to play on touch device
  // Anyway it's not very handy :)
  function onCanvasClick(event) {
    var element = event.target;
    var offsetX = 0, offsetY = 0;

    if (element.offsetParent) {
      do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    var x = event.pageX - offsetX;
    var y = event.pageY - offsetY;
    if (player.x < x && x < player.x + 100 && y < player.y + 70) {
      player.handleInput('up');
    } else if (player.x + 100 < x && player.y + 60 < y && y < player.y + 160) {
      player.handleInput('right');
    } else if (player.x < x && x < player.x + 100 && player.y + 140 < y) {
      player.handleInput('down');
    } else if (x < player.x && player.y + 60 < y &&  y < player.y + 160) {
      player.handleInput('left');
    }
  }

  // we detect the level by Player sprite
  function getLevel() {
    var sprite = player.sprite.toLowerCase();
    if (sprite.indexOf('boy') !== -1) {
      return 0;
    } else if (sprite.indexOf('pink') !== -1) {
      return 1;
    } else if (sprite.indexOf('cat') !== -1) {
      return 2;
    } else if (sprite.indexOf('horn') !== -1) {
      return 3;
    } else if (sprite.indexOf('princess') !== -1) {
      return 4;
    }
  }

  // Game reset function is called by button "reset", by game start and
  // on game over
  function reset() {
    player.reset();
    gem.reset();
    var level = getLevel();
    var enemyNumber = 3;
    var speed = 150;
    enemyNumber = 3;
    if (level === 1) {
      enemyNumber = 4;
    } else if (level > 1) {
      if (level === 3) {
        speed += 30;
      } else if (level === 4) {
        speed += 60;
      }
      enemyNumber = 5;
    }
    allEnemies.length = 0;
    for (var i = 0; i < enemyNumber; ++i) {
      allEnemies.push(new Enemy(speed));
    }
    score.value = 0;
  }

  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player
  var player = new Player();
  var textBoard = new TextBoard();
  var score = new Score();
  var gem = new Gem();
  var allEnemies = [];

  // This listens for key presses and sends the keys to your
  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      13: 'enter',
      32: 'space'
    };
    // handle keyboard characters to choose character
    if ($('#heroes:visible')) {
      var key = allowedKeys[e.keyCode];
      if (key === 'left' || key === 'right') {
        var $sibling, $selected;
        if (key === 'left') {
          $selected = $('.selected');
          $sibling = $selected.prev('.hero:not(.disabled)');
        } else if (key === 'right') {
          $selected = $('.selected');
          $sibling = $selected.next('.hero:not(.disabled)');
        }
        if ($selected.length && $sibling.length) {
          $selected.removeClass('selected');
          $sibling.addClass('selected');
        }
      } else if (key === 'space' || key === 'enter') {
        $('#start-btn').click();
      }
    }
    player.handleInput(allowedKeys[e.keyCode]);
  });

  $(document).ready(function() {
    $('.hero').click(function() {
      if (!$(this).is('.disabled')) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
      }
    });
    $('#start-btn').click(function() {
      $(this).hide();
      $('#menu-btn,#reset-btn').removeClass('hidden');
      $('#heroes').hide();
      Engine.init();
    });
    $('#menu-btn').click(function() {
      location.href = location.href;
    });
    $('#reset-btn').click(function() {
      reset();
    });
    var maxLevel = localStorage.getItem('maxLevel');
    if (maxLevel) {
      for (var i = 1; i <= maxLevel; ++i) {
        $('.level' + i).removeClass('disabled');
      }
    }
  });

  global.Game = {
    allEnemies: allEnemies,
    player: player,
    score: score,
    onCanvasClick: onCanvasClick,
    gem: gem,
    text: textBoard,
    reset: reset
  };
})(this);
