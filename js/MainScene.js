
class MainScene extends Phaser.Scene {

    constructor() {
        super("main");
    }

    preload() {
        this.load.image('tiles', 'res/Tileset.png');
        this.load.tilemapTiledJSON('map', 'res/Map_city2.json');
        this.load.image('background', 'res/skyline-a-long.png');
        this.load.image('background_1', 'res/buildings-bg-long.png');
        this.load.image('background_2', 'res/near-buildings-bg-long.png');
        this.load.image('disk', 'res/disk.png');
        this.load.image('sprites_doubleJump', 'res/doble jump.png');
        this.load.image('box', 'res/box.png');
        this.load.image('sprites_corazon', 'res/corazon.png');
        this.load.image('sprites_return', 'res/return.png');
        this.load.image('points', 'res/ScoreBoard.png');
        this.load.image('sprites_finish', 'res/finish.png');
        this.load.image('mensaje', 'res/mensaje.png');

        this.load.atlas('sprites_jugador', 'res/player_anim/player_anim.png',
            'res/player_anim/player_anim_atlas.json');

        this.load.atlas('sprites_bird', 'res/player_anim/ave.png',
            'res/player_anim/ave_atlas.json');

        this.load.atlas('sprites_fuegos', 'res/fuegos_artificiales/fuegos_artificiales.png',
            'res/fuegos_artificiales/fuegos_artificiales_atlas.json');

        this.load.spritesheet('tilesSprites', 'res/Tileset.png',
            { frameWidth: 32, frameHeight: 32 });
    }

    create() {

        this.createLoop(this, 2, 'background', 0);
        this.createLoop(this, 3, 'background_1', 0.5);
        this.createLoop(this, 3, 'background_2', 0.75);

        this.timeGameReal = 200;
        this.timeGame = this.timeGameReal;

        this.restartGame = false;

        this.IniciarLevel();


        //Vidas del jugador
        var points = this.add.sprite(85, 54, 'points').setScrollFactor(0);
        this.heart = this.add.sprite(60, 35, 'sprites_corazon');
        this.heart.setScale(0.50);
        this.heart.setScrollFactor(0);

        this.disk = this.add.sprite(60, 65, 'disk');
        this.disk.setScale(0.75);
        this.disk.setScrollFactor(0);

        //Total de puntos que va recogiendo en escenario
        this.heartText = this.add.text(80, 21, 'x ' + this.player.health, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

        this.diskText = this.add.text(80, 49, 'x ' + this.player.disk, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

        this.timeText = this.add.text(650, 20, 'Time:  ' + this.timeGame, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        });

        //seguimiento de objetos al moverse la pantalla
        this.heartText.setScrollFactor(0);
        this.diskText.setScrollFactor(0);
        this.timeText.setScrollFactor(0);


        this.textMensaje = this.add.text(17, 173, '!Debo conseguir los 10 \npara poder escapar\nde este mundo.!', {
            fontSize: '12px',
            fill: '#000',
            fontFamily: 'verdana, arial, sans-serif',
        });
        this.disk1 = this.add.sprite(170, 182, 'disk');
        this.disk1.setScale(0.5);
        this.ocultarMsn = false;

        //this.time.events.loop(Phaser.Timer.SECOND, this.showTime, this);
    }


    IniciarLevel() {
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Tileset', 'tiles');
        var layerBlockout = map.createLayer('Blockout', tiles, 0, 0);
        var layerBuilding = map.createLayer('Building', tiles, 0, 0);
        this.layerGround = map.createLayer('Ground', tiles, 0, 0);
        var layerAssets = map.createLayer('Assets', tiles, 0, 0);
        var layerBanner = map.createLayer('Banner', tiles, 0, 0);
        var layerLadder = map.createLayer('Ladder', tiles, 0, 0);

        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        //enable collisions for every tile
        this.layerGround.setCollisionByExclusion(-1, true);

        this.mensaje = this.add.sprite(100, 205, 'mensaje');
        this.mensaje.setScale(0.50);

        //necesitamos un player, finish
        this.player = new Player(this, 145, 263);
        this.finish = new FinishGame(this, 1680, 155);
        this.finish.setScale(0.3);
        this.finish.visible = false;

        this.fuego = new FuegosArtificiales(this, 1680, 155);
        this.fuego.visible = false;


        this.physics.add.collider(this.finish, this.layerGround);
        this.physics.add.collider(this.player, this.layerGround);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.physics.add.overlap(this.finish, this.player, this.finishGame, null, this);

        this.IniciarDiskBootEnemy(false);
    }

    IniciarDiskBootEnemy(reset) {
        if (reset == true) {
            this.Reset();
        }
        var map = this.make.tilemap({ key: 'map' });
        //creacion de los discos colectables
        var objectsJSON = map.getObjectLayer('Disks')['objects'];
        this.disks = [];
        for (let i = 0; i < objectsJSON.length; i++) {
            var obj = objectsJSON[i];
            if (obj.gid == 213) // gid de los discos
            {
                this.disks.push(new Disk(this, obj.x, obj.y));
                this.physics.add.overlap(this.disks, this.player, this.spriteHit, null, this);
            }
        }

        //creación de 3 objetos tipo Bird, que son los enemigos en diferentes posiciones del escenario
        this.birds = [];
        this.birds.push(new Bird(this, 895, 318, 340));
        this.birds.push(new Bird(this, 560, 100, 350));
        this.birds.push(new Bird(this, 1470, 330, 230));
        this.physics.add.collider(this.birds, this.layerGround);
        this.physics.add.overlap(this.birds, this.player, this.deadPlayer, null, this);

        //creacion de los zapatos para el doble salto
        var objBoot = map.getObjectLayer('DogleJump')['objects'];
        this.boots = [];
        for (let i = 0; i < objBoot.length; i++) {
            var objB = objBoot[i];
            if (objB.gid == 225) // gid de los zapatos
            {
                this.boots.push(new DoubleJump(this, objB.x, objB.y));
                this.physics.add.overlap(this.boots, this.player, this.dobleJump, null, this);
            }
        }

        this.boxs = [];
        this.boxs.push(new Box(this, 1100, 195));
        this.boxs.push(new Box(this, 1600, 195));
        this.physics.add.collider(this.boxs, this.player);
        this.physics.add.collider(this.boxs, this.layerGround);
    }

    Reset() {

        if (this.disks != undefined && this.disks.length != 0) {
            for (let i = 0; i < this.disks.length; i++) {
                this.disks[i].destroy();
            }
        }
        if (this.birds != undefined && this.birds.length != 0) {
            for (let i = 0; i < this.birds.length; i++) {
                this.birds[i].destroy();
            }
        }
        if (this.boots != undefined && this.boots.length != 0) {
            for (let i = 0; i < this.boots.length; i++) {
                this.boots[i].destroy();
            }
        }

        if (this.boxs != undefined && this.boxs.length != 0) {
            for (let i = 0; i < this.boxs.length; i++) {
                this.boxs[i].destroy();
            }
        }

        this.player.disk = 0;
        this.showDisk();
        this.showHeart();
    }


    //función para crear background infinito con efecto parallax
    createLoop(scene, count, texture, scrollFactor) {
        var x = 0;
        for (var i = 0; i < count; ++i) {
            var bg = scene.add.image(0, scene.scale.height, texture).setOrigin(0, 1).setScrollFactor(scrollFactor);
            x += bg.width;
        }
    }

    //función toma de disk para incrementar el puntaje y destruir el objeto
    spriteHit(sprite1, sprite2) {
        sprite1.destroy();
        sprite2.UpDisk();
        this.showDisk();
    }

    //función cuando el player choca contra el enemigo (bird)
    deadPlayer(sprite1, sprite2) {

        if (this.player.visible == true) {
            //this.player.RegresarInicio();
            if (this.player.health == 0) {
                this.GameOver();
            } else {
                this.player.Damaged();
                this.IniciarDiskBootEnemy(true);
            }
        }
    }

    //Función para presentar en pantalla Finish, cuando toca la bandera
    finishGame(sprite1, sprite2) {
        if (this.player.disk == 10) {
            sprite1.destroy();
            this.fuego.visible = true;
            this.ViewMessajeFinal('WINNER');
        }
    }

    //Función para presentar en pantalla Game over, cuando ya no tiene vidas el player
    GameOver() {
        this.ViewMessajeFinal('GAME OVER');
    }

    ViewMessajeFinal(mensaje) {
        this.showHeart();

        let x = this.player.x;
        if (x < this.screenCenterX) {
            x = this.screenCenterX;
        }

        if (x > 1600) {
            x = 1500;
        }
        //Texto de Game Over o Finish
        var gameOverText = this.add.text(x, this.screenCenterY, mensaje, {
            fontSize: '70px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-serif'
        }).setOrigin(0.5);

        //Boton replay para reiniciar el juego, pero no se encuentra implementado
        var returnButton = this.add.sprite(x, this.screenCenterY + 80, 'sprites_return').setOrigin(0.5);
        returnButton.setScale(0.30);

        returnButton.setInteractive();
        returnButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, function () {
            this.scene.scene.start("main");
        });

        this.player.speed = 0;
        this.player.visible = false;
    }

    //Función para tener un doble jump, solo tiene un solo doble jump.
    dobleJump(sprite1, sprite2) {
        this.player.doubleJump = true
        if (this.player.spriteDoubleJump != undefined && this.player.spriteDoubleJump != sprite1) {
            this.player.spriteDoubleJump.destroy();
        }
        this.player.spriteDoubleJump = sprite1;
        sprite1.setPosition(40, 130).setScrollFactor(0);
    }

    update(time, delta) {
        this.player.update(time, delta);
        for (let i = 0; i < this.birds.length; i++) {
            if (this.birds[i] != undefined)
                this.birds[i].update(time, delta);
        }
        for (let i = 0; i < this.boxs.length; i++) {
            if (this.boxs[i] != undefined)
                this.boxs[i].update(time, delta);
        }
        this.fuego.update(time, delta);
        this.showTime();


    }

    //Función para visualizar el puntaje en el escenario
    showHeart() {
        this.heartText.setText('x ' + this.player.health);
    }

    showDisk() {
        this.diskText.setText('x ' + this.player.disk);
        if (this.player.disk == 10) {
            this.finish.visible = true;
        }
    }

    showTime() {
        if (this.player.visible == true) {
            this.timeGame -= 0.015;
            this.timeText.setText('Time: ' + Math.round(this.timeGame));
            if (this.timeGame <= 0) {
                this.player.Damaged();
            }
        }
    }

    OcultarMensaje(ban) {
        if (this.mensaje.visible != ban) {
            this.mensaje.visible = ban;
            this.textMensaje.visible = ban;
            this.disk1.visible = ban;
        }
    }

}