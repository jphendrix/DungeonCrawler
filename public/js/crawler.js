/*global $*/
/*global dungeon*/

let canvas = {};
let ctx = {};
let _dungeon_size = 10; //10x10
let _x_offset = 100;
let _y_offset = 100;
let _zoom = 4;


$(function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    dungeon.map.initialize();

    dungeon.$events.on("map.ready",function(ev,room){
        drawGrid(800,800);
    });
    
    dungeon.$events.on("room.added",function(ev,room){
        drawRoom(room);
    });
    
    dungeon.$events.on("room.clicked",function(ev,room){
        displayInfo(room);
    });
    
    $("#canvas").off().on("click",function(ev){
        let canvas_offset = $("#canvas").offset();
        let point = {
            x:(ev.clientX-canvas_offset.left)-(_x_offset*_zoom),
            y:(ev.clientY-canvas_offset.top)-(_y_offset*_zoom)
        }
        
        let r = findRoom(point,_zoom);
        
        if(r && r.id>=0){
            dungeon.$events.trigger("room.clicked",r);    
        }
    });
    
    $("body").off().on("keydown",function(ev){
        console.log(ev);
        let redraw = false;
        switch(ev.code.toLowerCase()){
            case "arrowdown":
                if(ev.ctrlKey){
                    _zoom -= 0.1;
                }else{
                    _y_offset -= 10;
                }
                
                redraw = true;
                break;
            case "arrowup":
                if(ev.ctrlKey){
                    _zoom += 0.1;    
                }else{
                    _y_offset += 10;    
                }
                
                redraw = true;
                break;
            case "arrowleft":
                _x_offset += 10;
                redraw = true;
                break;
            case "arrowright":
                _x_offset -= 10;
                redraw = true;
                break;
            default:
                break;
        }
        
        if(redraw){
            drawMap();
        }
    });

});


function drawRoom(room){
    //draw the outline
    ctx.beginPath();
    ctx.fillRect((room.location[0].x+_x_offset)*_zoom, (room.location[0].y+_y_offset)*_zoom, room.width*_zoom, room.length*_zoom);
    ctx.stroke();
    
    ctx.strokeStyle = "silver";
    ctx.strokeText(room.id,(room.location[0].x+_x_offset)*_zoom,(room.location[0].y+_y_offset+5)*_zoom);
}

 
function displayInfo(room_id){
    let $info = $("<div class=info>");
    let room = dungeon.map.rooms[room_id];
    
    $info.append( $("<h3>",{text:`Room ID:${room_id} @ ${room.location[0].x},${room.location[0].y}`}) )
    $info.append( $("<p>",{text:`${room.description}.  the room is a ${room.width}x${room.length} ${room.shape}.  there are ${room.paths.length} paths of travel`}) )
   
    if(room.paths.length==1){
        $info.append( $("<p>",{text:'\nthis room is a dead end.'}) )
    }
    
    let $ul = $("<ul>")    
    for(let i=0; i<room.paths.length; i++){
        $ul.append( $("<li>",{text:`\none may travel ${room.paths[i].direction} via a ${room.paths[i].type} to room id: ${room.paths[i].destination}`}) );
    }

    $info.append($ul);
    $("div.info").empty();
    $("body").append($info);
}  

function findRoom(point,zoom){
    for(let i=0; i<dungeon.map.rooms.length; i++){
        let r = dungeon.map.rooms[i];
        let r_point = dungeon.map.rooms[i].location[0];
        
        let x1 = r_point.x*zoom;
        let x2 = (r_point.x+r.width)*zoom;
        
        let y1 = r_point.y*zoom;
        let y2 = (r_point.y+r.length)*zoom;
        
        if(point.x > x1 && point.x <x2 && point.y > y1 && point.y<y2){
            return r;
        }
    }
}
        
function drawMap(){
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
    
    drawGrid(800,800);
    
    for(let i=0; i<dungeon.map.rooms.length; i++){
        drawRoom(dungeon.map.rooms[i]);    
    }  
}