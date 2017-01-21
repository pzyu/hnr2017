Base.Menu = function() {
	// Variables we want to use

};

Base.Menu.prototype = {
	// Load whatever we need for Boot first
	preload: function() {
		// Preload our assets
		game.load.image("background", "assets/background.png");
		this.load.script('SCRIPT_MAIN', 'src/main.js');
		// Load sprite sheet (key, path, width, height, numOfFrames)
	},

	create: function() {

		// Create an array of tweets and reuse them
		// When it dies or goes out of screen, then move it above the screen and refresh the tweet

		// Add background
		var background = game.add.sprite(0, 0, "background");
		background.width = game.scale.width;
		background.height = game.scale.height;

		var text = game.add.text(game.world.centerX, game.world.centerY - 50, "#MTGA");

	    //  Centers the text
	    text.anchor.set(0.5);
	    text.align = 'center';

	    //  Our font + size
	    text.font = 'myfont';
	    text.fontWeight = 'bold';
	    text.fontSize = 200;
	    text.fill = '#ffffff';

	    //  Here we create our fake reflection :)
	    //  It's just another Text object, with an alpha gradient and flipped vertically

	    textReflect = game.add.text(game.world.centerX, game.world.centerY, "#MTGA");

	    //  Centers the text
	    textReflect.anchor.set(0.5);
	    textReflect.align = 'center';
	    textReflect.scale.y = -1;

	    //  Our font + size
	    textReflect.font = text.font;
	    textReflect.fontWeight = text.fontWeight;
	    textReflect.fontSize = text.fontSize;

	    //  Here we create a linear gradient on the Text context.
	    //  This uses the exact same method of creating a gradient as you do on a normal Canvas context.
	    var grd = textReflect.context.createLinearGradient(0, 0, 0, text.canvas.height);

	    //  Add in 2 color stops
	    grd.addColorStop(0, 'rgba(255,255,255,0)');
	    grd.addColorStop(1, 'rgba(255,255,255,0.08)');

	    //  And apply to the Text
	    textReflect.fill = grd;

	        // looks like we have to create a style for or menu option
	    var optionStyle = { font: '70pt myfont', fill: 'white', align: 'center' };
	    // the text for start
	    var txt = game.add.text(game.world.centerX, game.world.centerY + 150, 'Start', optionStyle);
	    txt.anchor.set(0.5);
	    // so how do we make it clickable?  We have to use .inputEnabled!
	    txt.inputEnabled = true;
	    // Now every time we click on it, it says "You did it!" in the console!
	    game.state.add('STATE_MAIN', Base.Main);
	    
	    txt.events.onInputUp.add(function () { 
	    	console.log('You did it!')
	    	game.state.start("STATE_MAIN");
	    });

	    txt.events.onInputOver.add(function (target) {
        	target.fill = "#ffff66";
		});

		txt.events.onInputOut.add(function (target) {
        	target.fill = "white";
		});

		

	},

	update: function() {

	},

	addMenuOption: function(text, callback) {
	    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
	    var txt = game.add.text(30, (this.optionCount * 80) + 200, text, optionStyle);
	    var onOver = function (target) {
	      target.fill = "#FEFFD5";
	      target.stroke = "rgba(200,200,200,0.5)";
	    };
	    var onOut = function (target) {
	      target.fill = "white";
	      target.stroke = "rgba(0,0,0,0)";
	    };
	    txt.stroke = "rgba(0,0,0,0";
	    txt.strokeThickness = 4;
	    txt.inputEnabled = true;
	    txt.events.onInputUp.add(callback);
	    txt.events.onInputOver.add(onOver);
	    txt.events.onInputOut.add(onOut);
	    this.optionCount ++;
  	}

};