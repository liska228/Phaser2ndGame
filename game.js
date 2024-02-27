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
var scoreText; // Текст рахунку
var canMove = true; // Змінна, що визначає, чи може гравець рухатися


// Функція для оновлення розмірів гри при зміні розмірів вікна браузера
window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

// Завантаження ресурсів
function preload() {
    this.load.image('sky', 'assets/sky.png'); // Завантаження зображення неба
    this.load.image('ground', 'assets/platform.png'); // Завантаження зображення платформи
    this.load.spritesheet('dude', 'assets/girl.png', { frameWidth: 100, frameHeight: 100 }); // Завантаження спрайту гравця
    this.load.image('house', 'assets/house.png'); // Завантаження зображення будинка
    this.load.image('ground1', 'assets/platform1.png'); // Завантаження зображення платформи
    this.load.image('star', 'assets/star.png'); // Завантаження зображення платформи
}
// Константа, щоб визначити ширину фону
const WORLD_WIDTH = 5000; // Змінено ширину світу для відображення додаткової платформи

/// Створення гри
function create() {
    // Додавання зображення неба і встановлення розміру на весь екран
    this.add.image(500, 500, 'sky').setDisplaySize(WORLD_WIDTH, 1000);

    // Створення платформ
    platforms = this.physics.add.staticGroup();

    // Розташовуємо першу платформу з самого низу екрану
    platforms.create(700, 1100, 'ground').setScale(2).refreshBody();

    // Розташовуємо другу платформу далі вправо, за межами екрану
    platforms.create(2200, 1100, 'ground').setScale(2).refreshBody(); // Додано другу платформу
    platforms.create(700, 800, 'ground1').setScale(2).refreshBody();
    platforms.create(1000, 600, 'ground1').setScale(2).refreshBody();
    platforms.create(1500, 800, 'ground1').setScale(2).refreshBody();
    platforms.create(2000, 650, 'ground1').setScale(2).refreshBody();
    platforms.create(2600, 550, 'ground1').setScale(2).refreshBody();

    // Додавання зображення house на першу платформу
    this.add.image(100, 900, 'house');

    // Створення гравця
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false); // Вимкнення обмежень за межами світу гри

    // Колізія гравця з платформами
    this.physics.add.collider(player, platforms);
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
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
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
        repeat: 40, // Кількість зірок (змініть за потребою)
        setXY: { x: 250, y: 50, stepX: 70 } // Відстань між зірками (змініть за потребою)
    });

    // Налаштування властивостей зірок
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Колізія зірок з платформами
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

// Функція для обробки колізії зірок та гравця
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);


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
