var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
}

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background.jpg');
}

function create(){

}

function update(){

}