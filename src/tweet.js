Base.Tweet = function() {
	// (context, game, x, y, sprite_key, 0)
	Phaser.Sprite.call(this, game, 200, 200, "trump", 0);
	// Variables we want to use
	// Tweet text
	this.text = "I loved beating these two terrible human beings. I would never recommend that anyone use her lawyer, he is a total loser!";

	this.textWidth = 300;

	// Animation
	this.animations.add('walk');
	this.animations.play('walk', 5, true);

	// Text style
    var style = { font: "16px myfont", fill: "#fff", wordWrap: true, wordWrapWidth: this.textWidth, align: "center"};

    // Text object
	this.textObject = game.add.text(0, 0, this.text, style);
	this.textObject.anchor.set(0.5);

	// Keyboard
	this.keyboard = game.input.keyboard;
	this.keyboard.onDownCallback = this.checkInput;
	this.keyboard.callbackContext = this;
};

Base.Tweet.prototype = Object.create(Phaser.Sprite.prototype);
Base.Tweet.prototype.constructor = Base.Tweet;

Base.Tweet.prototype.update = function() {
	this.centerTextOnSprite();
};

Base.Tweet.prototype.checkInput = function(key) {
	// If keycode > 67, then -32
	// Get first index
	var currentChar = this.text.charAt(0).toLowerCase();
	// console.log(currentChar +": "+ this.text.charAt(0));
	// console.log(key.keyCode +": "+key.key);
	// If same key
	if (currentChar == key.key) {
		// console.log("Remove");
		// Remove first character
		this.text = this.text.substring(1);
		// Update text
		this.textObject.setText(this.text);
	}
}

Base.Tweet.prototype.centerTextOnSprite = function() {
	this.textObject.x = Math.floor(this.x + this.width/2);
	this.textObject.y = Math.floor(this.y + this.height * 2);
}