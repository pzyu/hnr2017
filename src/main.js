Base.Main = function() {
	// Variables we want to use
	Base.tweetList = [];
	this.tweetAmt = 5;
	Base.correctChars = 0;
	// Keyboard
	this.keyboard = game.input.keyboard;
	this.keyboard.onDownCallback = this.checkInput;
	this.keyboard.callbackContext = this;

};

Base.Main.prototype = {
	// Load whatever we need for Boot first


	preload: function() {
		// Preload our assets
    	game.load.image("spark", "assets/spark.png");
    	game.load.image("blood", "assets/blood.png");
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

		// Add emitter
		this.emitter = game.add.emitter(0, 0, 100);
		// Init emitter
		this.emitter.makeParticles("spark");
		this.emitter.gravity = 200;
		this.emitter.setAlpha(0, 1, 100);

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
		this.trumpEmitter.gravity = 100;
		this.trumpEmitter.setAlpha(0, 1, 100);

		for (var i = 0; i < this.tweetAmt; i++) {
			Base.tweetList[i].emitter = this.trumpEmitter;
		}

		// Add timer
		var text = 0;
		var timeElapsed = 0;
		
		function logTime() {
			timeElapsed++;
			var WPM = Number(Base.correctChars / 5 / (timeElapsed / 60)).toFixed(0);
			text.setText("WPM:" + WPM);
		}

    	game.time.events.loop(Phaser.Timer.SECOND, logTime, this);

		text = game.add.text(100, 75, "WPM:0", { font: "32px myfont", fill: "#ffffff", align: "left" });

	    game.physics.startSystem(Phaser.Physics.ARCADE);

	},

	update: function() {

	},

	// Retrieve key from first tweet
	checkInput: function(key) {
		var currentTweet = Base.tweetList[0];
		var currentChar = currentTweet.getFirst();

		// console.log("Char code:" + currentChar);
		// console.log("My key: " + key.key);

		// If valid
		if (key.key == currentChar) {
			currentTweet.removeFirst(key.key);
			// Add particle burst
			Base.correctChars++;
			this.emitter.x = currentTweet.textObject.x;
			this.emitter.y = currentTweet.textObject.y + 5;
			this.emitter.start(true, 1000, null, 10);
		} else {
			// Punish
			currentTweet.playSmile();
		}
	}


};