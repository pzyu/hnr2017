// Global object
var Base = {
	gameWidth: 1280,
	gameHeight: 720,
  tweetList: [],
  correctChars: 0,
  tweets: []
}

var config = {width: Base.gameWidth, height: Base.gameHeight, renderer: Phaser.AUTO, forceSetTimeOut: false};

var game = new Phaser.Game(config);

Base.Boot = function() {
};

Base.Boot.prototype = {
  // Load whatever we need for Boot first
  preload: function () {
    // this.load.image('splashLogo', 'images/splash_logo.png');

    // Load font first since it takes time
    this.load.script('SCRIPT_WEBFONT', 'src/webfontloader.js');
    this.loadFonts();

    this.load.script('SCRIPT_MENU', 'src/menu.js'); 
    this.load.script('SCRIPT_MAIN', 'src/main.js');
    this.load.script('SCRIPT_TWEET', 'src/tweet.js');
    Base.tweets = game.load.json("tweets", "assets/tweets.json");


    this.load.atlas('trump', 'assets/spritesheet.png', 'assets/spritesheet.json');
    game.load.image("background", "assets/background.png");
  },

  loadFonts: function() {
      // Loading fonts
      WebFontConfig = {
          custom: {
              families: ['myfont'],
              urls: ['src/font.css']
          }
      }
  },

  // Create stuff in phaser
  create: function () {
    Base.tweets = game.cache.getJSON("tweets");

    // Set game scale with page
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertitally = true;
    
    // Timeout to delay for font loading
    setTimeout(function(){
      // Add loading text
      this.status = game.add.text(Base.gameWidth/2, Base.gameHeight/2, 'Loading...', {font: "32px myfont", fill: 'white'});

      // Main state goes to main gamee
      game.state.add('STATE_MENU', Base.Menu);
      game.state.add('STATE_MAIN', Base.Main);

      game.state.start('STATE_MENU');
    }, 500);
  }
};

// Init boot state
game.state.add('STATE_BOOT', Base.Boot);
game.state.start('STATE_BOOT');
