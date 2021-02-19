/*global $*/
let canvas = {};
let ctx = {};
    
$(function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    drawGrid(500,500,50);
});


let drawGrid = function(w, h, size) {
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    for (let x = 0; x <= w; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        for (let y = 0; y <= h; y += size) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
    }
    ctx.stroke();
};
    
