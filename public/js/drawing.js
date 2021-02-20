/*global $*/
let canvas = {};
let ctx = {};
let _dungeon_size = 10; //10x10
let _dungeon = [];

$(function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    _dungeon = createDungeon(_dungeon_size);
    
    drawGrid(_dungeon_size*50,_dungeon_size*50,50);

    for(let x=0; x<_dungeon.length; x++){
        for(let y=0; y<_dungeon[x].length; y++){
	        console.log(x,y,_dungeon[x][y].room.floor);
            drawColor(x*50,y*50,50,_dungeon[x][y].room.floor);
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

function createDungeon(size){
    
    let d=[];
    d.length = size;
    
    for(let x=0; x<size; x++){
        d[x] = [];
        for(let y=0; y<size; y++){
            
            let dungeon_copy = JSON.parse(JSON.stringify(d)); //Make a copy of this dungeon
            
            let room = createRoom(x,y,d);
            
            d[x].push({x:x,y:y,room:room});
        }
    }
    return d;
}

function createRoom(x,y,dungeon){
    
    let room = {
        floor:'stone',
        doors:[],
        contents:[]
    }
    
    //TODO for later
    /*
        peeking into neighboring rooms of the dungon.  If the room has
        already been created, then that might give us hints as to what 
        this room looks like.  i.e if the room to the north of us, has
        a door to the south then that means this new room must have a 
        door to the north.
        
        north = dungeon[x+1][y];
        south = dungeon[x-1][y];
        east = dungeon[x][y-1];
        west = dungeon[x][y+1];
    */
    
    room.floor = 'dirt';
    
    let number_of_doors = getRandomNumber(3); //between 0 & 3
	if(number_of_doors<1)
		room.floor = 'none';
//if number of doors is zero then floor type is 'none'

    for(let i=0; i<number_of_doors; i++){
        
        //TODO:  You might get the same door more than once.  Add code to prevent to of the same door
        room.doors.push(getRandomDoor());
    }
    
    //Add contents to the room
    room.contents.push({type:'envrionment',air:true});
    
    //TODO: Make these random
    room.contents.push({type:'item',item:'dagger'});
    room.contents.push({type:'creature', creature:'bugbear'});
    room.contents.push({type:'item',item:'table',description:'table push to the north side of the wall.  Some stale half eaten bread is molding next to a dry wine flagon'});
            
    return room;
}



function getRandomNumber(max){
    return Math.floor( Math.random() * Math.floor(max) );
}

function getRandomDoor(){
    let r =getRandomNumber(doors.length);
    return doors[r];
}

let doors = [
    {location:'north',locked:false, description:''},
    {location:'south',locked:false},
    {location:'east',locked:false, description:''},
    {location:'west',locked:false, description:''},
    {location:'above',locked:true, description:'Trap door in the cieling.  Very sturdy.  Will not budge'}
]

function drawColor(x,y,w,floor){
    //todo: use a diffent color for differnt floor types
	if (floor == 'dirt') {
        ctx.fillStyle = "#FF0770";
    } else {
        ctx.fillStyle = "#000050";
    }
        ctx.fillRect(x, y, w, w);
}


let starting_area = {
    dice:10,
    configurations:[
        {min:1,max:1, config:{shape:'square',width:20,length:20,description:'passage on each wall'}},
        {min:2,max:2, config:{shape:'square',width:20,length:20,description:'door on two walls, passage on thrid wall'}},
        {min:3,max:3, config:{shape:'square',width:40,length:40,description:'doors on three walls'}},
        {min:4,max:4, config:{shape:'rectangle',width:80,length:20,description:'row of pillers down the middle, two passages on long walls, one door on each short wall'}},
        {min:5,max:5, config:{shape:'rectangle',width:20,length:40,description:'passage on each wall'}},
        {min:6,max:6, config:{shape:'circle',width:40,length:40,description:'one passage at each cardinal direction'}},
        {min:7,max:7, config:{shape:'circle',width:40,length:40,description:'one passage at each cardinal direction, well in center(may lead to lower level eventually)'}},
        {min:8,max:8, config:{shape:'square',width:20,length:20,description:'door on two walls, passage on third, secret door on fourth'}},
        {min:9,max:9, config:{shape:'passage',width:10,length:30,description:'T intersection'}},
        {min:10,max:10, config:{shape:'passage',width:10,length:50,description:'four-way intersection'
    ]
}