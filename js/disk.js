class Disk extends MySprite {
    constructor(scene, x, y) {
        super(scene, x, y,'disk');
        this.body.allowGravity = false;   
    }
}