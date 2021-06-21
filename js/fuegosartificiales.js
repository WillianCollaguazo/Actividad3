class FuegosArtificiales extends MySprite {
    constructor(scene, x, y, recorrido) {
        super(scene, x, y, 'sprites_fuegos');
        this.body.allowGravity = false;  
        this.setOrigin(0, 1);

        this.anims.create({
            key: 'winner',
            frames: this.scene.anims.generateFrameNames('sprites_fuegos', { start: 0, end: 24, prefix: 'fuegos_artificiales_' }),
            frameRate: 7,
            repeat: -1
        });
    }

    //Animación de fuegos artíficiales al terminar el juego
    update(time, delta) {
        this.play('winner', true);
    }
}