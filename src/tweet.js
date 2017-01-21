Base.Tweet = function() {
	Phaser.Sprite.call(this, game, 200, 200, "trump", 0);
	// Variables we want to use
	this.text = "I loved beating these two terrible human beings. I would never recommend that anyone use her lawyer, he is a total loser!";
	this.textWidth = 300;

	this.animations.add('walk');

	this.animations.play('walk', 5, true);

    var style = { font: "16px myfont", fill: "#fff", wordWrap: true, wordWrapWidth: this.textWidth, align: "center"};
	this.textObject = game.add.text(0, 0, this.text, style);
	this.textObject.anchor.set(0.5);

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
	var currentChar = this.text.charAt(0).toLowerCase();
	// console.log(currentChar +": "+ this.text.charAt(0));
	// console.log(key.keyCode +": "+key.key);
	if (currentChar == key.key) {
		// console.log("Remove");
		this.text = this.text.substring(1);
		this.textObject.setText(this.text);
	}
}

Base.Tweet.prototype.centerTextOnSprite = function() {
	this.textObject.x = Math.floor(this.x + this.width/2);
	this.textObject.y = Math.floor(this.y + this.height * 2);
}