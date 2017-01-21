Base.Tweet = function(count) {
	// (context, game, x, y, sprite_key, 0)
	Phaser.Sprite.call(this, game, 200, 200, "trump", 0);
	// Variables we want to use
	// Tweet text
	this.text = "";
	this.textWidth = 300;

	// Padding for spawn
	this.paddingLeft = 100;
	this.paddingRight = 250;

	// Falling speed
	this.speedY = 0.75;

	// Animation
	this.animations.add('walk');
	this.animations.play('walk', 5, true);

	this.spawn(count);
};

Base.Tweet.prototype = Object.create(Phaser.Sprite.prototype);
Base.Tweet.prototype.constructor = Base.Tweet;

Base.Tweet.prototype.update = function() {
	this.centerTextOnSprite();
	this.move();
};

Base.Tweet.prototype.move = function() {
	this.y += this.speedY;

	if (this.y > 580) {
		Base.tweetList.push(Base.tweetList.shift());
		// Die and spawn
		this.spawn(1);
	}
};

Base.Tweet.prototype.spawn = function(count) {
	this.text = "I loved beating these two terrible human beings. I would never recommend that anyone use her lawyer, he is a total loser!";
	this.text = "test";

	this.x = (Math.random() * (game.scale.width - this.paddingRight)) + this.paddingLeft;
	console.log(this.x);
	this.y = -250 * count;

	// Text style
    var style = { font: "16px myfont", fill: "#7CFC00", wordWrap: true, wordWrapWidth: this.textWidth};

    // Text object
	this.textObject = game.add.text(0, 0, this.text, style);
	this.textObject.anchor.set(0, 0);
	this.textObject.addColor("#fff", 1);

	// Shift first element to end of array
	//console.log(Base.tweetList);
};

Base.Tweet.prototype.removeFirst = function(key) {
	this.text = this.text.substring(1);
	this.textObject.setText(this.text);
	this.textObject.addColor("#fff", 1);

	if (this.text == "") {
		Base.tweetList.push(Base.tweetList.shift());
		this.spawn(1);
	}
};

Base.Tweet.prototype.getFirst = function() {
	return this.text.charAt(0);
}

Base.Tweet.prototype.centerTextOnSprite = function() {
	this.textObject.x = Math.floor(this.x - this.width - 20);
	this.textObject.y = Math.floor(this.y + this.height + 20);
};