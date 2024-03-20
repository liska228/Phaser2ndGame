var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload, // Передзавантаження ресурсів
        create: create, // Створення гри
        update: update // Оновлення гри
    }
};

// Ініціалізація гри
var game = new Phaser.Game(config);
var score = 0; // Початковий рахунок гравця
var scoreText;
var lifeText; // Текст рахунку
var canMove = true; // Змінна, що визначає, чи може гравець рухатися
var Life = 5;
var bomb;
var LifeText;

// Функція для оновлення розмірів гри при зміні розмірів вікна браузера
window.addEventListener('resize', function () {
     game.scale.resize(window.innerWidth, window.innerHeight);
});

// Завантаження ресурсів
function preload() {
    this.load.image('sky', 'assets/sky.png'); // Завантаження зображення неба
    this.load.image('ground', 'assets/platform1.png'); // Завантаження зображення платформи
    this.load.image('ground2', 'assets/platform2.png'); // Завантаження зображення платформи
    this.load.spritesheet('dude', 'assets/girl.png', { frameWidth: 100, frameHeight: 100 }); // Завантаження спрайту гравця
    this.load.image('house', 'assets/house.png'); // Завантаження зображення будинка
    this.load.image('ground1', 'assets/platform.png'); // Завантаження зображення платформи
    this.load.image('star', 'assets/star.png');
    this.load.image('tree', 'assets/Tree.png'); 
    this.load.image('stone', 'assets/Stone.png');
    this.load.image('bush', 'assets/bush.png');
    this.load.image('platformStart', 'assets/platformStart.png');
    this.load.image('platformOne', 'assets/platformOne.png');
    this.load.image('platformFinish', 'assets/platformFinish.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('player2', 'assets/frog.png');
    this.load.image('player3', 'assets/frog.png');
    this.load.image('player4', 'assets/frog.png');
    this.load.image('player5', 'assets/frog.png');
    this.load.image('player6', 'assets/frog.png');
}
// Константа, щоб визначити ширину фону
const WORLD_WIDTH = 5000; // Змінено ширину світу для відображення додаткової платформи

/// Створення гри
function create() {
    // Додавання зображення неба і встановлення розміру на весь екран
    this.add.tileSprite(0, 0, WORLD_WIDTH, 1080, 'sky').setOrigin(0,0).setDepth(0);

    // Створення платформ
    platforms = this.physics.add.staticGroup();

    trees = this.physics.add.staticGroup();

    stones = this.physics.add.staticGroup();

    bushes = this.physics.add.staticGroup();

    // Розташовуємо першу платформу з самого низу екрану
    for (var x=0; x < WORLD_WIDTH; x=x+128){
        console.log(x)
        platforms.create(x, 1080-128, 'ground2').setOrigin(0,0).refreshBody();
    }
    for (var x = 0; x < WORLD_WIDTH; x = x + Phaser.Math.Between(600, 700)) { 
        var y = Phaser.Math.FloatBetween(700, 93 * 9) 
        platforms.create(x, y, 'platformStart').setDepth(5);
        var i;
    for (i = 1; i < Phaser.Math.Between(0, 5); i++) { 
        platforms.create(x + 100 * i, y, 'platformOne').setDepth(5)}

         platforms.create(x + 100 * i, y, 'platformFinish').setDepth(5);
     }


    for (var x = 900; x < WORLD_WIDTH; x = x + Phaser.Math.FloatBetween(100, 1000)) {
      console.log(' x-' + x)
    trees.create(x, 1080 - 128, 'tree').setOrigin(0, 1).setScale(Phaser.Math.FloatBetween(0.5, 1.5)).refreshBody().setDepth(Phaser.Math.Between(1,10));
    }

    for (var x = 900; x < WORLD_WIDTH; x = x + Phaser.Math.FloatBetween(100, 1000)) {
        console.log(' x-' + x)
      stones.create(x, 1080 - 128, 'stone').setOrigin(0, 1).setScale(Phaser.Math.FloatBetween(0.5, 1.5)).refreshBody().setDepth(Phaser.Math.Between(1,10));
      }

      for (var x = 900; x < WORLD_WIDTH; x = x + Phaser.Math.FloatBetween(100, 1000)) {
        console.log(' x-' + x)
      bushes.create(x, 1080 - 128, 'bush').setOrigin(0, 1).setScale(Phaser.Math.FloatBetween(0.5, 1.5)).refreshBody().setDepth(Phaser.Math.Between(1,10));
      }

      

    // Додавання зображення house на першу платформу
    this.add.image(100, 900, 'house').setDepth(20);


    // Створення гравця
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false); // Вимкнення обмежень за межами світу гри
    player.setDepth(5)

    player2 = this.physics.add.sprite(810, 400, 'player2').setDepth(5).setScale(2);
    player2.setVelocityY(230);
    player2.setVelocityX(180);
    var direction = -1; // Починаємо з руху вліво
    player2.setVelocityX(180 * direction); // Встановлення початкової швидкості
    var direction = Phaser.Math.Between(0, 1) ? 1 : -1; // 1 - рух вправо, -1 - рух вліво
    player2.setVelocityX(180 * direction); // 
    // Колізія гравця з платформами
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
    player2.setCollideWorldBounds(true);
    player2.setBounce(1);
    setInterval(function () {
        // Зміна напрямку руху
        direction *= -1; // Змінюємо напрямок (з вліво на вправо або навпаки)
        player2.setVelocityX(180 * direction); // Встановлюємо нову швидкість залежно від напрямку
      }, Phaser.Math.Between(1000, 35000));

  this.physics.add.collider(player2, player);
  cursors = this.input.keyboard.createCursorKeys();

  player3 = this.physics.add.sprite(2003, 2332, 'player3').setDepth(5).setScale(2);
  player3.setVelocityY(230);
  player3.setVelocityX(180);
  var direction = -1; // Починаємо з руху вліво
  player3.setVelocityX(180 * direction); // Встановлення початкової швидкості
  var direction = Phaser.Math.Between(0, 1) ? 1 : -1; // 1 - рух вправо, -1 - рух вліво
  player3.setVelocityX(180 * direction); // 
  // Колізія гравця з платформами
  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();
  player3.setCollideWorldBounds(true);
  player3.setBounce(1);
  setInterval(function () {
      // Зміна напрямку руху
      direction *= -1; // Змінюємо напрямок (з вліво на вправо або навпаки)
      player2.setVelocityX(180 * direction); // Встановлюємо нову швидкість залежно від напрямку
    }, Phaser.Math.Between(1000, 35000));

this.physics.add.collider(player3, player);
cursors = this.input.keyboard.createCursorKeys();

    // Налаштування анімацій гравця
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end:  6}),
        frameRate: 10,
        repeat: -1
    });

    // Налаштування камери
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, window.innerHeight);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, window.innerHeight);

    // Слідкування камери за гравцем
    this.cameras.main.startFollow(player);
    // Створення та розміщення зображення "star" на верхніх платформах
    const stars = this.physics.add.group({
        key: 'star',
        repeat: 100, // Кількість зірок (змініть за потребою)
        setXY: { x: 250, y: 50, stepX: 70 } // Відстань між зірками (змініть за потребою)
    });

    
    // Налаштування властивостей зірок
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    //Додала бомби
    bombs = this.physics.add.group();
    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //Колізія бомб 
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Колізія зірок з платформами
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    //Додавання тексту
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' })
    .setOrigin(0,0) 
    .setScrollFactor(0);
    //Додавання життя
    lifeText=this.add.text(1500, 100, showLife(), {fontSize: '40px', fill:'#FFF'})
    .setOrigin(0,0) 
    .setScrollFactor(0);
}

// Функція для обробки колізії зірок та гравця
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    var x = (player.x < 5000) ? Phaser.Math.Between(400, 5000) : Phaser.Math.Between(0, 5000);
    
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
    

}

//Функція смуги життя
function showLife() {
    var lifeLine='  '

    for(var i=0; i< Life; i++){
        lifeLine = lifeLine += '💖';
    }
    return lifeLine;
}


// Оновлення гри
function update() {
    // Оновлення фону, якщо гравець дійшов до межі екрану
    if (player.x >= this.cameras.main.worldView.right) {
        this.add.image(this.cameras.main.worldView.right + 500, 500, 'sky').setDisplaySize(WORLD_WIDTH, 1000);
    }

    // Перевірка, чи гравець може рухатися
    if (canMove) {
        if (cursors.left.isDown) {
            player.setVelocityX(-160); // Рух вліво
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160); // Рух вправо
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0); // Зупинка гравця
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-380); // Пристріл вгору, тільки коли гравець на платформі
        }
    }

 }

 function createBomb(star) {
   // Створення бомби під час збору зірки
   var bomb = this.physics.add.image(star.x, star.y - 900, 'bomb').setGravityY(300); // Змінені координати для з'явлення бомби зверху
   this.physics.add.collider(bomb, platforms, function(bomb, platform) {
       bomb.setVelocityY(-600); // Задайте вектор швидкості у протилежному напрямку від вертикальної швидкості платформи
   });
   // Задання горизонтальної швидкості бомби
   var direction = Phaser.Math.Between(0, 1) ? 1: -1; // Випадково вибираємо напрямок (-1 або 1)
   var horizontalSpeed = Phaser.Math.Between(100, 200) * direction; // Горизонтальна швидкість
   bomb.setVelocityX(horizontalSpeed);
 
   // Зміна напрямку бомб, якщо вона зіштовхується з верхніми платформами
   this.physics.add.collider(bomb, platforms, function(bomb, platform) {
       bomb.setVelocityX(-bomb.body.velocity.x); // Змінюємо напрямок бомби, віднімаючи її поточну горизонтальну швидкість
   });
   bomb.setCollideWorldBounds(true);
   bomb.setBounce(1);
   this.physics.add.collider(player, bomb, function() { hitBomb(player, bomb); }); // Додайте колізію гравця з бомбою та обробник
 }
//функція торкання бомб з  гравцем
function hitBomb(player, bomb) {
    // this.physics.pause();
    bomb.disableBody(true, true);

    
    Life -= 1;
    lifeText.setText(showLife());

    console.log('boom')
    player.anims.play('turn');

    if (Life == 0){
        gameOver();
    }
}

 function refreshBody(){
   console.log('game over')
   this.scene.restart();
 };
 
 
 function gameOver() {
    player.setTint(0xff0000); // замалювати гравця червоним кольором 
    this.physics.pause();
   console.log('Гра закінчилася!');
 }