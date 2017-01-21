Base.Main = function() {
	// Variables we want to use
	Base.tweetList = [];
	this.tweetAmt = 5;
	
	// Keyboard
	this.keyboard = game.input.keyboard;
	this.keyboard.onDownCallback = this.checkInput;
	this.keyboard.callbackContext = this;

};

Base.Main.prototype = {
	// Load whatever we need for Boot first
	preload: function() {
		// Preload our assets
		game.load.image("background", "assets/background.png");
		game.load.image("spark", "assets/spark.png");
		// Load sprite sheet (key, path, width, height, numOfFrames)
		game.load.spritesheet("trump", "assets/trump.png", 64, 64, 18);
		
	},

	create: function() {

		// Add background
		var background = game.add.sprite(0, 0, "background");
		background.width = game.scale.width;
		background.height = game.scale.height;

		// Add emitter
		this.emitter = game.add.emitter(0, 0, 100);
		console.log(this.emitter);

		// Init emitter
		this.emitter.makeParticles("spark");
		this.emitter.gravity = 200;
		this.emitter.setAlpha(0, 1, 100);

		// Add WPM

		// Create all tweets and store in array
		for (var i = 0; i < this.tweetAmt; i++) {
			console.log("Spawning");
			var newTweet = new Base.Tweet(i);
			Base.tweetList[i] = newTweet;
			game.add.existing(newTweet);
		}

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
			currentTweet.removeFirst();
			// Add particle burst
			this.emitter.x = currentTweet.textObject.x;
			this.emitter.y = currentTweet.textObject.y + 5;
			console.log(this.emitter);
			this.emitter.start(true, 1000, null, 10);
		} else {
			// Punish
		}
	}
};