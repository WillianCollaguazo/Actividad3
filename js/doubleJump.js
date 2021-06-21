class DoubleJump extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprites_doubleJump');
        this.body.allowGravity = false;
        this.setScale(0.12);
        
    }
}