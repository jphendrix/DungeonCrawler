/*global $*/
let canvas = {};
let ctx = {};
let _dungeon_size = 10; //10x10
let _x_offset = 100;
let _y_offset = 100;
let _zoom = 1.1;


$(function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    drawGrid(_dungeon_size*50,_dungeon_size*50,50);

    for(let x=0; x<100; x++){
        for(let y=0; y<100; y++){
        }
    }
});


let drawGrid = function(w, h) {
    let size = 10;
    
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    for (let x = 0; x <= w; x += size*_zoom) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        for (let y = 0; y <= h; y += size*_zoom) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
    }
    ctx.stroke();
};


function drawRoom(room){

    ctx.fillRect((room.location[0].x+_x_offset)*_zoom, (room.location[0].y+_y_offset)*_zoom, room.width*_zoom, room.length*_zoom);
    
    //draw the outline
    ctx.beginPath();
    ctx.strokeStyle = '#808080';
    ctx.moveTo((room.location[0].x+_x_offset)*_zoom,(room.location[0].y+_y_offset)*_zoom)
    for(let i=1; i<room.location.length; i++){
        ctx.lineTo((room.location[i].x+_x_offset)*_zoom,(room.location[i].y+_y_offset)*_zoom);        
    }
    ctx.lineTo((room.location[0].x+_x_offset)*_zoom,(room.location[0].y+_y_offset)*_zoom);
    ctx.stroke();
    
    ctx.strokeText(room.id,(room.location[0].x+_x_offset)*_zoom,(room.location[0].y+_y_offset+5)*_zoom);
}

function zoom(z){
    _zoom = z;
    
    drawGrid(800,800);
    
    for(let i=0; i<dungeon.map.rooms.length; i++){
        drawRoom(dungeon.map.rooms[i]);    
    }    
}
  
