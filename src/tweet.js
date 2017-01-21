Base.Tweet = function(count) {
	// (context, game, x, y, sprite_key, 0)
	Phaser.Sprite.call(this, game, 200, 200, "trump", 0);
	// Variables we want to use
	// Tweet text
	this.text = "";
	this.textLength = 0;
	this.lengthPercentage = 100;
	this.textWidth = 300;

	// Padding for spawn
	this.paddingLeft = 100;
	this.paddingRight = 250;

	// Falling speed
	this.speedY = 0.15;

	// Animation state has default, hurt, bleed, fatal, dead
	this.animState = "default";

	// Animation
	this.animations.add('anim_idle_default', ["idle1-1", "idle1-2", "idle1-3"], 4, true);
	this.animations.add('anim_idle_hurt', ["idle2-1", "idle2-2", "idle2-3"], 4, true);
	this.animations.add('anim_idle_bleed', ["idle3-1", "idle3-2", "idle3-3"], 4, true);
	this.animations.add('anim_idle_fatal', ["idle4-1", "idle4-2", "idle4-3"], 4, true);
	this.animations.add('anim_idle_dead', ["idle5-1", "idle5-2", "idle5-3"], 4, true);

	this.animations.add('anim_smile_default', ["smile1-1"], 1, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_smile_hurt', ["smile2-1"], 1, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_smile_bleed', ["smile3-1"], 1, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_smile_fatal', ["smile4-1"], 1, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_smile_dead', ["smile5-1"], 1, false).onComplete.add(this.playIdle, this);

	this.animations.add('anim_angry_default', ["angry1-1", "angry1-2"], 2, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_angry_hurt', ["angry2-1", "angry2-2"], 2, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_angry_bleed', ["angry3-1", "angry3-2"], 2, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_angry_fatal', ["angry4-1", "angry4-2"], 2, false).onComplete.add(this.playIdle, this);
	this.animations.add('anim_angry_dead', ["angry5-1", "angry5-2"], 2, false).onComplete.add(this.playIdle, this);

	this.animations.play("anim_smile_default");
	
	// Text style
    var style = { font: "16px myfont", fill: "#7CFC00", wordWrap: true, wordWrapWidth: this.textWidth, strokeThickness: 1, stroke: "#000000"};
	this.textObject = game.add.text(0, 0, this.text, style);

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

Base.Tweet.prototype.handleStatus = function() {
	this.lengthPercentage = this.text.length/this.textLength * 100;

	console.log(this.lengthPercentage);
}

Base.Tweet.prototype.spawn = function(count) {
	this.text = "I loved beating these two terrible human beings. I would never recommend that anyone use her lawyer, he is a total loser!";
	this.textLength = this.text.length;

	this.lengthPercentage = this.text.length/this.textLength * 100;

	this.textObject.setText(this.text);

	this.x = (Math.random() * (game.scale.width - this.paddingRight)) + this.paddingLeft;
	this.y = -250 * count;

    // Text object
	this.textObject.anchor.set(0, 0);
	this.textObject.addColor("#fff", 1);

	// Shift first element to end of array
	//console.log(Base.tweetList);
};

Base.Tweet.prototype.removeFirst = function(key) {
	this.text = this.text.substring(1);
	this.textObject.setText(this.text);
	this.textObject.addColor("#fff", 1);

	this.handleStatus();

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

Base.Tweet.prototype.playIdle = function() {
	this.animations.play("anim_idle_" + this.animState);
};