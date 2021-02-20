/*global $*/
let canvas = {};
let ctx = {};
let _dungeon_size = 10; //10x10


$(function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    drawGrid(_dungeon_size*50,_dungeon_size*50,50);

    for(let x=0; x<100; x++){
        for(let y=0; y<100; y++){
        }
    }
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


function drawColor(x,y,w,floor){
    //todo: use a diffent color for differnt floor types
	if (floor == 'dirt') {
        ctx.fillStyle = "#FF0770";
    } else {
        ctx.fillStyle = "#000050";
    }
        ctx.fillRect(x, y, w, w);
}

  
