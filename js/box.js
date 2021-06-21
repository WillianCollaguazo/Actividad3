class Box extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');
        this.setScale(0.7);
        this.setImmovable(true);
        this.speed = 5;
    }

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

        if (this.y > 550) {
            this.visible=false;
        }
    }
}