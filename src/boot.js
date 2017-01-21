// Global object
var Base = {
	gameWidth: 1280,
	gameHeight: 720,
  tweetList: [],
  currentIndex: 0,
  correctChars: 0,
  incorrectChars: 0,
  lives: 3,
  tweets: [],
  score: 0,
  speedConstant: 40,
  music: {},
  coinSFX: null,
  billSFX: null,
  trumpSFX: []
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

    //this.load.script('SCRIPT_MENU', 'src/menu.js'); 
    this.load.script('SCRIPT_MAIN', 'src/main.js');
    this.load.script('SCRIPT_TWEET', 'src/tweet.js');
    game.load.json("tweets", "assets/tweets.json");


    this.load.atlas('trump', 'assets/spritesheet.png', 'assets/spritesheet.json');
    game.load.image("background", "assets/background.png");
    game.load.audio('USA', 'assets/USA.mp3');
    game.load.audio('SFX_bill', 'assets/bill.wav');
    game.load.audio('SFX_coin', 'assets/coin.wav');

    game.load.audio('SFX_vx_0', 'assets/the_american_dream_is_dead.wav');
    game.load.audio('SFX_vx_1', 'assets/thank_you_darling.wav');
    game.load.audio('SFX_vx_2', 'assets/ive_been_watching_you_for_the_last_couple_of_weeks.mp3');
    game.load.audio('SFX_vx_3', 'assets/im_really_rich.wav');
    game.load.audio('SFX_vx_4', 'assets/i_just_want_them_to_suffer.mp3');
    game.load.audio('SFX_vx_5', 'assets/i_beat_china_all_the_time.wav');
    game.load.audio('SFX_vx_6', 'assets/fantastic.mp3');
    game.load.audio('SFX_vx_7', 'assets/maga.wav');
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

    // Setup music
    Base.music = game.add.audio('USA');
    

    // Set game scale with page
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertitally = true;
    
    // Timeout to delay for font loading
    setTimeout(function(){
      // Add loading text
      this.status = game.add.text(Base.gameWidth/2, Base.gameHeight/2, 'Loading...', {font: "32px myfont", fill: 'white'});

      // Main state goes to main gamee
      //game.state.add('STATE_MENU', Base.Menu);
      game.state.add('STATE_MAIN', Base.Main);

      game.state.start('STATE_MAIN');
    }, 500);


    Base.coinSFX = new Phaser.Sound(game, "SFX_coin", 0.1);
    Base.billSFX = new Phaser.Sound(game, "SFX_bill", 0.3);

    for (var i = 0; i < 8; i++) {
      Base.trumpSFX[i] = new Phaser.Sound(game, "SFX_vx_" + i, 1);
    }
  }
};

// Init boot state
game.state.add('STATE_BOOT', Base.Boot);
game.state.start('STATE_BOOT');
