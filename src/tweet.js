Base.Tweet = function(count, tutorialText) {
	// (context, game, x, y, sprite_key, 0)
	Phaser.Sprite.call(this, game, -500, -500, "trump", 0);
	// Variables we want to use
	// Tweet text
	this.text = "";
	this.textLength = 0;
	this.lengthPercentage = 100;
	this.textWidth = 300;

	// If this tweet is current
	this.isCurrent = false;

	// Padding for spawn
	this.paddingLeft = 100;
	this.paddingRight = 350;

	// Falling speed
	this.speedX = (Math.random() * 5) + 1;
	this.speedY = 40;

	this.isTutorial = tutorialText != null;

	// Add emitter
	this.emitter;

	// // Check world bounds
	// this.checkWorldBounds = true;
	// this.isInView = false;

	// this.events.onEnterBounds.add(function() {
	// 	console.log("in view");
	// 	this.inInView = true;
	// }, this);

	// this.events.onOutOfBounds.add(function() {
	// 	console.log("not in view");
	// 	this.inInView = false;
	// }, this);

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
    var style = { font: "16px myfont", fill: "#7CFC00", wordWrap: true, wordWrapWidth: this.textWidth, align: "none", strokeThickness: 2, stroke: "#000000"};
	this.textObject = game.add.text(-200, -200, this.text, style);

	this.spawn(count, tutorialText);
};

Base.Tweet.prototype = Object.create(Phaser.Sprite.prototype);
Base.Tweet.prototype.constructor = Base.Tweet;

Base.Tweet.prototype.update = function() {
	this.centerTextOnSprite();
	this.move();
};

Base.Tweet.prototype.move = function() {
	this.y += this.speedY;

	if (this.y > game.scale.height * 0.8) {
		Base.tweetList.push(Base.tweetList.shift());

		Base.currentIndex = null;
		this.isCurrent = false;
		this.animState = "default";
		this.textObject.addColor("#7CFC00", 0);
		this.emitBlood();
		game.camera.shake(0.05, 200);
		
		//console.log("Dead tweet" + Base.currentIndex);
		//Base.music._sound.playbackRate.value *= 0.8;
		// Die and spawn
		// If it's a tutorial, spawn further back
		if (this.isTutorial) {
			this.isTutorial = false;
			this.spawn(4.5);
		} else {
			Base.lives--;
			this.spawn((Math.random() * 2) + 1);
			Base.music._sound.playbackRate.value *= 1.2;
		}
	}
};

Base.Tweet.prototype.handleStatus = function() {
	this.lengthPercentage = this.text.length/this.textLength * 100;

	// Check length percentage
	if (this.lengthPercentage < 20) {
		// Dead
		if (this.animState != "dead") {
			this.animState = "dead";
			Base.score += (Math.random() * 25) + 10;
			this.emitBlood();
			Base.billSFX.play();
			this.playRandomTrump();
			game.camera.shake(0.01, 100);	
		}
	} else if (this.lengthPercentage < 40) {
		// Fatal
		if (this.animState != "fatal") {
	 		this.animState = "fatal";
	 		Base.score += (Math.random() * 25) + 10;
			this.emitBlood();
			Base.billSFX.play();
			this.playRandomTrump();
			game.camera.shake(0.005, 100);	
		}
	} else if (this.lengthPercentage < 60) {
		// Bleed
		if (this.animState != "bleed") {
			this.animState = "bleed";
			Base.score += (Math.random() * 25) + 10;
			this.emitBlood();
			Base.billSFX.play();
			this.playRandomTrump();
			game.camera.shake(0.005, 100);	
		}
	} else if (this.lengthPercentage < 80) {
		// Hurt
		if (this.animState != "hurt") {
			this.animState = "hurt";
			Base.score += (Math.random() * 25) + 10;
			this.emitBlood();
			Base.billSFX.play();
			this.playRandomTrump();
			game.camera.shake(0.005, 100);	
		}
	} else {
		// Default
		this.animState = "default";
	}
};

Base.Tweet.prototype.playRandomTrump = function() {
	// console.log(Base.trumpSFX);
	Base.trumpSFX[Math.floor(Math.random() * 6)].play();
}

Base.Tweet.prototype.emitBlood = function() {
	this.emitter.x = this.x + this.width/2;
	this.emitter.y = this.y + this.height/2;
	this.emitter.start(true, 2000, null, 25);
}

Base.Tweet.prototype.spawn = function(count, tutorialText) {
	var index = Math.floor(Math.random() * Base.tweets.tweets.length);
	this.text = tutorialText ? tutorialText : Base.tweets.tweets[index];
	//this.text = Base.tweets.tweets[index];

	this.textLength = this.text.length;
	this.speedY = Base.speedConstant / this.textLength;
	this.textObject.setText("");

	this.lengthPercentage = this.text.length/this.textLength * 100;

	this.x = (Math.random() * (game.scale.width - this.paddingRight)) + this.paddingLeft;
	this.y = -400 * count;


	//console.log("X: " + this.x + " Y: " + this.y + "Speed: " + this.speedY);

    // Text object
	this.textObject.anchor.set(0, 0);
	var startFrom = this.isCurrent ? 1 : 0;
	//console.log(startFrom);
	this.textObject.addColor("#7CFC00", 0);
	this.textObject.addColor("#fff", startFrom);


	// Add tween
	var tweenDist = (Math.random() * 100) + 50;
	var tweenSpeed = (Math.random() * 2000) + 1000;

	var tween = game.add.tween(this).to( { x: this.x + tweenDist}, tweenSpeed, Phaser.Easing.Linear.None, true, 0, -1);
	tween.yoyo(true, 0);


	this.textObject.setText(this.text);

	this.animState = "default";	
	this.animations.play("anim_idle_default");
};

Base.Tweet.prototype.removeFirst = function(key) {
	this.text = this.text.substring(1);
	this.textObject.setText(this.text);

	var startFrom = this.isCurrent ? 1 : 0;
	// console.log(this.isCurrent + " " + startFrom);
	this.textObject.addColor("#7CFC00", 0);
	this.textObject.addColor("#fff", startFrom);
	Base.score += 0.01;
	Base.coinSFX.play();
	this.handleStatus();

	// Knockback
	if (this.y >= 50) {
		this.y -= 6;
	}

	// If we have completed a word, Trump will be angry
	if (key === " ") {
		this.playAngry();	
	}

	// If we have finished typing
	if (this.text == "") {
		//Base.score += 100;
		game.camera.shake(0.01, 200);

		this.isCurrent = false;
		Base.currentIndex = null;
		this.animState = "default";
		this.textObject.addColor("#7CFC00", 0);
		Base.speedConstant *= 1.025;

		this.emitBlood();
		Base.billSFX.play();
		// Shift first element to end of array
		Base.tweetList.push(Base.tweetList.shift());
		//console.log(this.isTutorial);

		// If it's a tutorial, spawn further back
		if (this.isTutorial) {
			this.isTutorial = false;
			this.spawn(4.5);
		} else {
			this.spawn(1);
		}
	}
};

Base.Tweet.prototype.getFirst = function() {
	return this.text.charAt(0);
}

Base.Tweet.prototype.centerTextOnSprite = function() {
	this.textObject.x = Math.floor(this.x - this.width - 30);
	this.textObject.y = Math.floor(this.y + this.height + 5);
};

Base.Tweet.prototype.playIdle = function() {
	this.animations.play("anim_idle_" + this.animState);
};

Base.Tweet.prototype.playAngry = function() {
	this.animations.play("anim_angry_" + this.animState);
};

Base.Tweet.prototype.playSmile = function() {
	this.animations.play("anim_smile_" + this.animState);
};