(function() {
	window.onload = function () {
	  enchant();

	  var game = new Game(960, 640);
	  game.onload = function () {
	    var scene = new Scene(); // Add Node // Example // scene.addChild(sprite); game.pushScene(scene);

	    var sprite = new Sprite(64, 64);
		sprite.image = game.assets['res/chara0.gif'];
		scene.addChild(sprite);

		var label = new Label("test");
		scene.addChild(label);
		
		game.pushScene(scene);

	  };
	  game.start();
	}
}());