class Box extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');
        this.setScale(0.7);
        this.setImmovable(true);
        this.speed = 5;
    }

    //Se mueve la caja cuando es tocado a la izquierda o derecha de la caja.
    update(time, delta) {
        if (this.body.touching.left) {
            this.setVelocityX(this.speed * delta);
        }
        else
            if (this.body.touching.right) {
                this.setVelocityX(-this.speed * delta);
            }
            else
                this.setVelocityX(0);

        //si la caja se cae de la plataforma, se hace invisible.
        if (this.y > 550) {
            this.visible=false;
        }
    }
}