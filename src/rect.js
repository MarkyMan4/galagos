// this could potentially have a function for drawing a rectangle
// that way every class doesn't have to do the whole ctx.beginPath()... etc.
class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}