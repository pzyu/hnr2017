Base.Main = function() {
	// Variables we want to use
	this.tweetList;
	// this.keyboard = game.input.keyboard;
	// this.keyboard.onDownCallback = this.checkInput;
	// this.keyboard.callbackContext = this;
};

Base.Main.prototype = {
	// Load whatever we need for Boot first
	preload: function() {
		// Preload our assets
		game.load.image("background", "assets/background.png");
		// Load sprite sheet (key, path, width, height, numOfFrames)
		game.load.spritesheet("trump", "assets/trump.png", 64, 64, 18);
		
	console.log("eleadas");
	},

	create: function() {

		// Create an array of tweets and reuse them
		// When it dies or goes out of screen, then move it above the screen and refresh the tweet

		// Add background
		var background = game.add.sprite(0, 0, "background");
		background.width = game.scale.width;
		background.height = game.scale.height;

		// Add WPM
		var test = new Base.Tweet();
		game.add.existing(test);
	},

	update: function() {

	}

	// checkInput: function(key) {
	// var currentChar = this.text.charAt(0).toLowerCase();
	// // console.log(currentChar +": "+ this.text.charAt(0));
	// // console.log(key.keyCode +": "+key.key);
	// if (currentChar == key.key) {
	// 	// console.log("Remove");
	// 	this.text = this.text.substring(1);
	// 	this.textObject.setText(this.text);
	// }
};