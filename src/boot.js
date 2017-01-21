// Global object
var Base = {
	gameWidth: 1280,
	gameHeight: 720,
  tweetList: []
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

    this.load.script('SCRIPT_MAIN', 'src/main.js');
    this.load.script('SCRIPT_TWEET', 'src/tweet.js');
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
    // Set game scale with page
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertitally = true;
    
    // Timeout to delay for font loading
    setTimeout(function(){
      // Add loading text
      this.status = game.add.text(Base.gameWidth/2, Base.gameHeight/2, 'Loading...', {font: "32px myfont", fill: 'white'});

      // Main state goes to main game
      game.state.add('STATE_MAIN', Base.Main);
      game.state.start('STATE_MAIN');
    }, 500);
  }
};

// Init boot state
game.state.add('STATE_BOOT', Base.Boot);
game.state.start('STATE_BOOT');
