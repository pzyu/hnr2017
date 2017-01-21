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
	this.isReset = false;

	this.isInMenu = true;

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
	},

	create: function() {
		console.log(game.cache.getJSON("tweets"));

		// Add background
		var background = game.add.sprite(0, 0, "background");
		background.width = game.scale.width;
		background.height = game.scale.height;

		this.startMenu();
	},

	startMenu: function() {
		this.textMenu = game.add.text(game.world.centerX, game.world.centerY - 50, "#MTGA");

	    //  Centers the text
	    this.textMenu.anchor.set(0.5);
	    this.textMenu.align = 'center';

	    //  Our font + size
	    this.textMenu.font = 'myfont';
	    this.textMenu.fontWeight = 'bold';
	    this.textMenu.fontSize = 200;
	    this.textMenu.fill = '#ffffff';

	    //  Here we create our fake reflection :)
	    //  It's just another Text object, with an alpha gradient and flipped vertically

	    this.textReflect = game.add.text(game.world.centerX, game.world.centerY, "#MTGA");

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

	        // looks like we have to create a style for or menu option
	    var optionStyle = { font: '70pt myfont', fill: 'white', align: 'center' };
	    // the text for start
	    this.optionText = game.add.text(game.world.centerX, game.world.centerY + 150, 'Start', optionStyle);
	    this.optionText.anchor.set(0.5);
	    // so how do we make it clickable?  We have to use .inputEnabled!
	    this.optionText.inputEnabled = true;
	    // Now every time we click on it, it says "You did it!" in the console!
	    //game.state.add('STATE_MAIN', Base.Main);
	    
	    this.optionText.events.onInputUp.add(function () {
	    	this.isInMenu = false;
	    	this.menuFadeOut();
			Base.billSFX.play();
	    }, this);

	    this.optionText.events.onInputOver.add(function (target) {
        	target.fill = "#ffff66";
		});

		this.optionText.events.onInputOut.add(function (target) {
        	target.fill = "white";
		});
	},

	menuFadeOut: function() {
    	game.add.tween(this.textReflect).to( { alpha: 0 }, 1000, "Linear", true);
    	var menuTween = game.add.tween(this.textMenu).to( { alpha: 0 }, 1000, "Linear", true);
    	menuTween.onComplete.add(this.initGame, this);
    	game.add.tween(this.optionText).to( { alpha: 0 }, 1000, "Linear", true);
	},

	initGame: function() {
		// Add emitter
		this.emitter = game.add.emitter(0, 0, 100);
		// Init emitter
		this.emitter.makeParticles("spark");
		this.emitter.gravity = 200;
		//this.emitter.setAlpha(1, 0, 1500);

		// Create all tweets and store in array
		for (var i = 0; i < this.tweetAmt; i++) {
			console.log("Spawning");
			var newTweet = new Base.Tweet(i);
			Base.tweetList[i] = newTweet;
			game.add.existing(newTweet);
		}

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
			var wpm = Number(Base.correctChars / 5 / (timeElapsed / 60)).toFixed(0);
			wordsPerMin.setText("  WPM: " + wpm);
			var acc = Number(Base.correctChars / (Base.correctChars + Base.incorrectChars) * 100).toFixed(0);
			accuracy.setText("  ACC: " + acc + "%");
			health.setText("   HP: " + Base.lives);
			
			Base.speedConstant *= 1.01;
		}

    	game.time.events.loop(Phaser.Timer.SECOND, logTime, this);

    	this.score = game.add.text(60, 50, " Cash: $0.00", { font: "32px myfont", fill: "#ffffff", align: "left" });
		var wordsPerMin = game.add.text(60, 75, "  WPM: 0", { font: "32px myfont", fill: "#ffffff", align: "left" });
		var accuracy = game.add.text(60, 100, "  ACC: 0%", { font: "32px myfont", fill: "#ffffff", align: "left" });
		var health = game.add.text(60, 125, "   HP: 3", { font: "32px myfont", fill: "#ffffff", align: "left" });

 
	    game.physics.startSystem(Phaser.Physics.ARCADE);
	},

	update: function() {

	},

	// Retrieve key from first tweet
	checkInput: function(key) {
		if (this.isInMenu) {
	    	this.isInMenu = false;
	    	// this.initGame();
	    	this.menuFadeOut();

			this.emitter.x = 500;
			this.emitter.y = 500;
			this.emitter.start(true, 1000, null, 3);

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
				console.log("Null index");
				// Otherwise, look through array
				for (var i = 0; i < this.tweetAmt; i++) {
					console.log(Base.tweetList[i].getFirst());
					// We have found a tweet and index
					if(Base.tweetList[i].getFirst() == key.key) {
						// Set current index 
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