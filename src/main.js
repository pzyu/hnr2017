Base.Main = function() {
	// Variables we want to use
	this.tweetList;
};

Base.Main.prototype = {
	// Load whatever we need for Boot first
	preload: function() {
		// Preload our assets
		game.load.image("background", "assets/background.png");
		game.load.spritesheet("trump", "assets/trump.png", 64, 64, 18);
	},

	create: function() {

		// Create an array of tweets and reuse them
		// When it dies or goes out of screen, then move it above the screen and refresh the tweet


		// var mySprite;
		// Add background
		var background = game.add.sprite(0, 0, "background");
		background.width = game.scale.width;
		background.height = game.scale.height;

		// Add WPM
		var test = new Base.Tweet();
		this.game.add.existing(test);
	},

	update: function() {

	}
};