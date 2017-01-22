Base.Main = function() {
	// Variables we want to use
	Base.tweetList = [];
	this.tweetAmt = 5;
	Base.correctChars = 0;
	Base.incorrectChars = 0;
	Base.lives = 3;
	Base.score = 0;
	Base.speedConstant = 40;

	// Keep track of current tweet
	Base.currentIndex = null;

	// Keyboard
	this.keyboard = game.input.keyboard;
	this.keyboard.onDownCallback = this.checkInput;
	this.keyboard.callbackContext = this;
};

Base.Main.prototype = {
	// Load whatever we need for Boot first
	preload: function() {
		// Preload our assets
    	game.load.image("spark", "assets/coin.png");
    	game.load.image("blood", "assets/bill.png");
		// Load sprite sheet (key, path, width, height, numOfFrames)
		//game.load.spritesheet("trump", "assets/spritesheet.png", 64, 64, 30);
		game.load.json("tweets", "assets/tweets.json");

		game.camera.flash('#000000', 2000);
	},

	create: function() {
		// console.log(game.cache.getJSON("tweets"));

		// Add background
		var background = game.add.sprite(0, 0, "background");
		background.width = game.scale.width;
		background.height = game.scale.height;

		Base.trumpSFX[7].play();
    	Base.music.play("", 0, 0.3, true);

		this.startMenu();
	},

	startMenu: function() {
		//console.log("Restart");
		this.textMenu = game.add.text(game.world.centerX, 0, "#MTGA");
		//this.textMenu = game.add.text(game.world.centerX, game.world.centerY - 50, "#MTGA");

		this.isReset = false;

		this.isInMenu = true;
		this.isGameOver = false;
	    //  Centers the text
	    this.textMenu.anchor.set(0.5);
	    this.textMenu.align = 'center';

	    //  Our font + size
	    this.textMenu.font = 'myfont';
	    this.textMenu.fontWeight = 'bold';
	    this.textMenu.fontSize = 100;
	    this.textMenu.fill = '#ffffff';

	    Base.correctChars = 0;
	    Base.incorrectChars = 0;

	    //  Here we create our fake reflection :)
	    //  It's just another Text object, with an alpha gradient and flipped vertically

	    //this.textReflect = game.add.text(game.world.centerX, game.world.centerY, "#MTGA");
	    this.textReflect = game.add.text(game.world.centerX, 50, "#MTGA");

	    this.textMenu.setText("#Make Typing Great Again");
	    this.textReflect.setText("#Make Typing Great Again");

	    //  Centers the text
	    this.textReflect.anchor.set(0.5);
	    this.textReflect.align = 'center';
	    this.textReflect.scale.y = -1;

	    //  Our font + size
	    this.textReflect.font = this.textMenu.font;
	    this.textReflect.fontWeight = this.textMenu.fontWeight;
	    this.textReflect.fontSize = this.textMenu.fontSize;

	    //  Here we create a linear gradient on the Text context.
	    //  This uses the exact same method of creating a gradient as you do on a normal Canvas context.
	    var grd = this.textReflect.context.createLinearGradient(0, 0, 0, this.textMenu.canvas.height);

	    //  Add in 2 color stops
	    grd.addColorStop(0, 'rgba(255,255,255,0)');
	    grd.addColorStop(1, 'rgba(255,255,255,0.08)');

	    //  And apply to the Text
	    this.textReflect.fill = grd;

	    this.menuDone = false;
	    this.isClicked = false;
	  
	    

    	var titleTween = game.add.tween(this.textMenu).to({y: game.world.centerY - 50}, 2500, "Linear", true);
    	game.add.tween(this.textReflect).to({y: game.world.centerY}, 2500, "Linear", true);

    	titleTween.onComplete.add(function() {
    		game.camera.shake(0.01, 500);
			// looks like we have to create a style for or menu option
		    var optionStyle = { font: '50pt myfont', fill: 'white', align: 'center' };
		    // the text for start
		    this.optionText = game.add.text(game.world.centerX, game.world.centerY + 150, 'Press anything to start', optionStyle);
		    this.optionText.anchor.set(0.5);
		    // so how do we make it clickable?  We have to use .inputEnabled!
		    this.optionText.inputEnabled = true;

		    this.menuDone = true;

		    this.optionText.events.onInputUp.add(function () {
		    	if (!this.isClicked) {
		    		this.isInMenu = false;
		    		this.menuFadeOut();
		    		this.isClicked = true;
				}
				if (this.isGameOver && this.isClicked) {
					Base.lives = 3;
					this.isGameOver = false;
					game.state.start("STATE_MAIN");
				}
				Base.billSFX.play();
		    }, this);

		    this.optionText.events.onInputOver.add(function (target) {
	        	target.fill = "#ffff66";
			});

			this.optionText.events.onInputOut.add(function (target) {
	        	target.fill = "white";
			});

			this.tween = game.add.tween(this.optionText).to( { alpha: 0 }, 500, "Linear", true, 0, -1);
			this.tween.yoyo(true, 0);
    	}, this);
	},

	menuFadeOut: function() {
		this.tween.stop();
    	game.add.tween(this.textReflect).to( { alpha: 0 }, 1000, "Linear", true);
    	var menuTween = game.add.tween(this.textMenu).to( { alpha: 0 }, 1000, "Linear", true);
    	menuTween.onComplete.add(this.initGame, this);
    	this.tween = game.add.tween(this.optionText).to( { alpha: 0 }, 1000, "Linear", true, 0, 0);
	},

	menuFadeIn: function() {
    	this.textMenu.y = this.textReflect.y = game.scale.height / 4;

	    var optionStyle = { font: '24pt myfont', fill: 'white', align: 'right'};
    	this.scoreText = game.add.text(game.world.centerX - 250, game.world.centerY - 100, 'Your Cash: $' + Base.score.toFixed(2), optionStyle);
    	this.wpmText = game.add.text(game.world.centerX - 250, game.world.centerY - 50, 'Your Words per Minute: ' + this.wpm + 'WPM', optionStyle);
    	this.accText = game.add.text(game.world.centerX - 250, game.world.centerY, 'Your Accuracy: ' + this.acc + '%', optionStyle);

		game.add.tween(this.textReflect).to( { alpha: 1 }, 1000, "Linear", true);
    	var menuTween = game.add.tween(this.textMenu).to( { alpha: 1 }, 1000, "Linear", true);
    	this.tween = game.add.tween(this.optionText).to( { alpha: 1 }, 500, "Linear", true, 0, -1);
    	this.tween.yoyo(true, 0);
	},

	initGame: function() {
		// Add emitter
		this.emitter = game.add.emitter(0, 0, 100);
		// Init emitter
		this.emitter.makeParticles("spark");
		this.emitter.gravity = 200;
		//this.emitter.setAlpha(1, 0, 1500);

		// Create all tweets and store in array
		// for (var i = 0; i < this.tweetAmt; i++) {
		// 	// console.log("Spawning");
		// 	var newTweet = new Base.Tweet(i);
		// 	Base.tweetList[i] = newTweet;
		// 	game.add.existing(newTweet);
		// }

		Base.tweetList[0] = new Base.Tweet(0, "Welcome to #Make Typing Great Again");
		Base.tweetList[1] = new Base.Tweet(1, "This is a modest collection of Donald Trump's tweets, and your job is to type them out");
		Base.tweetList[2] = new Base.Tweet(2, "You can play by simply typing the first letter of the tweet. Letters are case-sensitive!");
		Base.tweetList[3] = new Base.Tweet(3, "To deselect a tweet, hit backspace and you can choose another tweet to type out");
		Base.tweetList[4] = new Base.Tweet(7, "Have fun, and remember to #Make Typing Great Again");

		game.add.existing(Base.tweetList[0]);
		game.add.existing(Base.tweetList[1]);
		game.add.existing(Base.tweetList[2]);
		game.add.existing(Base.tweetList[3]);
		game.add.existing(Base.tweetList[4]);

		// Pause tweets till last is gone

		this.trumpEmitter = game.add.emitter(0, 0, 100);
		// Init emitter
		this.trumpEmitter.makeParticles("blood");
		this.trumpEmitter.gravity = 150;
		//this.trumpEmitter.setAlpha(1, 0, 2000);

		for (var i = 0; i < this.tweetAmt; i++) {
			Base.tweetList[i].emitter = this.trumpEmitter;
		}

		// Set is current of first one as true
		//Base.tweetList[Base.currentIndex].isCurrent = true;

		// Add timer

		// WPM
		var timeElapsed = 0;
		
		function logTime() {
			timeElapsed++;
			this.wpm = Number((Base.correctChars / 3) / (timeElapsed / 60)).toFixed(0);
			this.wordsPerMin.setText("  WPM: " + this.wpm);
			this.acc = Base.correctChars == 0 ? 100 : Number(Base.correctChars / (Base.correctChars + Base.incorrectChars) * 100).toFixed(0);
			this.accuracy.setText("  ACC: " + this.acc + "%");
			this.health.setText("   Lives left: " + Base.lives);
		}

    	game.time.events.loop(Phaser.Timer.SECOND, logTime, this);

    	var style = {font: "48px myfont", fill: "#fff600", align: "left", strokeThickness: 8, stroke: "#000000"};

    	this.score = game.add.text(game.scale.width/2 - 250, game.scale.height - 100, " Cash: $0.00", style);
		this.wordsPerMin = game.add.text(game.scale.width/2 + 150, game.scale.height - 100, "  WPM: 0", style);
		this.accuracy = game.add.text(game.scale.width/2 + 400, game.scale.height - 100, "  ACC: 100%", style);
		this.health = game.add.text(game.scale.width/2 - 750, game.scale.height - 100, "   Lives left: 3", style);

 
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	},

	update: function() {
		if (Base.lives <= 0 && !this.isGameOver) {
			this.isGameOver = true;

			// Fantastic
			Base.trumpSFX[6].play();

			for (var i = 0; i < this.tweetAmt; i++) {
				Base.tweetList[i].y = -5000;
			}

			this.textMenu.setText("Game Over");
	    	this.textReflect.setText("Game Over");
	    	this.optionText.setText("Try again?")

			this.gameOver();
		}
	},

	gameOver: function() {
		this.menuFadeIn();
		//this.isGameOver = false;
		Base.lives = 3;
		for (var i = 0; i < this.tweetAmt; i++) {
			Base.tweetList[i].speedY = 0;
		}
		this.score.y = this.wordsPerMin.y = this.accuracy.y = this.health.y = 2000;
	},

	// Retrieve key from first tweet
	checkInput: function(key) {
		if (!this.menuDone) {
			return;
		}

		if (this.isGameOver) {
			this.isClicked = false;
			Base.lives = 3;
			this.isGameOver = false;
			game.state.start("STATE_MAIN");
		}

		if (this.isInMenu) {
	    	this.isInMenu = false;
	    	// this.initGame();
	    	this.menuFadeOut();

			// this.emitter.x = 500;
			// this.emitter.y = 500;
			// this.emitter.start(true, 1000, null, 3);

			Base.billSFX.play();
	    	return;
		} else {
			// Backspace
			if (key.keyCode == 8) {
				// Reset color
				Base.tweetList[Base.currentIndex].textObject.addColor("#fff", 0);
				// Reset current index
				Base.currentIndex = null;
			}

			// If we have selected a tweet
			if (Base.currentIndex != null) {
				var currentTweet = Base.tweetList[Base.currentIndex];
				var currentChar = currentTweet.getFirst();

				// Set the is current
				Base.tweetList[Base.currentIndex].isCurrent = true;
				// console.log("Char code:" + currentChar);
				// console.log("My key: " + key.key);

				// If valid
				if (key.key == currentChar) {
					currentTweet.removeFirst(key.key);

					// Add particle burst
					Base.correctChars++;
					
					this.emitter.x = currentTweet.textObject.x;
					this.emitter.y = currentTweet.textObject.y + 5;
					this.emitter.start(true, 1000, null, 3);

					this.score.setText(" Cash: $" + Base.score.toFixed(2));
				} else {
					// Punish
					if (Base.score >= 5) {
						Base.score -= 5;	
					}
					Base.incorrectChars++;
					currentTweet.playSmile();
				}
			} else {
				//console.log("Null index");
				// Otherwise, look through array
				for (var i = 0; i < this.tweetAmt; i++) {
					// console.log(Base.tweetList[i].getFirst());
					// If first key is right && tweet is in camera
					if(Base.tweetList[i].getFirst() == key.key && Base.tweetList[i].inCamera) {
						Base.currentIndex = i;
						Base.correctChars++;

						// Remove the key as usual then break
						Base.tweetList[i].removeFirst(key.key);
						this.emitter.x = Base.tweetList[i].textObject.x;
						this.emitter.y = Base.tweetList[i].textObject.y + 5;
						this.emitter.start(true, 1000, null, 3);
						break;
					}
				}
			}
		}
	}


};