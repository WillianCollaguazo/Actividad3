class Bird extends MySprite {
    constructor(scene, x, y, recorrido) {
        super(scene, x, y, 'sprites_bird');

        this.setOrigin(0, 1);
        this.left = true;

        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_bird', { start: 1, end: 8, prefix: 'vuela_' }),
            frameRate: 7,
            repeat: -1
        });
        //Movimiento del bird de izquierda a derecha de acuerdo al parametro recorrido.
        this.tiempo = recorrido;
        this.cont = 0;
    }

    update(time, delta) {
        this.play('walk', true);
        this.cont++;
        if (this.left) {
            this.setVelocityX(-2 * delta);
            this.setFlipX(false);
        }
        if (!this.left) {
            this.setVelocityX(2 * delta);
            this.setFlipX(true);
        }

        if (this.cont >= this.tiempo && this.left) {
            this.left = false;
            this.cont = 0;
        }
        if (this.cont >= this.tiempo && !this.left) {
            this.left = true;
            this.cont = 0;
        }

    }
}