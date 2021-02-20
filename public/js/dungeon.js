Number.prototype.throwDice = function() {
   return Math.floor( (Math.random() * Math.floor(this.valueOf()-1))+1 );
};


let dungeon_template = {
    dungeon:{
        rooms:[
            {id:0,location:[{x:0,y:0},{x:0,y:100},{x:100,y:100},{x:0,y:100}]},
            {id:1,location:[{},{},{},{}]}
        ],
        doors:[
            {
                id:0,
                location:{x:100,y:50},
                front:{room_id:1,status:['closed','locked'],construction:'wood',description:'Strong strudy wooden door with a map pinned with a dagger'},
                back:{room_id:0,construction:'wood',status:['closed'],description:'strong sturdy door'}
            }
        ]
    }
};

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
        {min:10,max:10, config:{shape:'passage',width:10,length:50,description:'four-way intersection'}}
    ]
}

//TODO: Merge this into the other creae froom function
//TODO: implement shapes other than rectangle
//location is the x,y of the top left point
//width is along the x axis, length is the y axis
//shape is rectangle, triangle, or circle
function createRoomv2(location,width,length,shape){
    let room = {};
    
    //a room's location is determined by the points that make us the walls
    room.location = [];
    
    //top-left
    room.location.push({location});
    
    //top-right
    room.location.push({x:location.x + width,y:location.y});
    
    //bottom-right
    room.location.push({x:location.x+width,y:location.y+length});
    
    //bottom-left
    room.location.push({x:location.x,y:location.y+length});
    
}

function createDungeon(){
    
    let dungeon = {};
    
    let initial_room = {}
    
    //roll dice to get initial room
    let d = starting_area.dice.throwDice();
    
    for(let i=1; i<d; i++){
        let c = starting_area.configurations[i];
        
        if(d >= c.min && d <= c.max){
            //We found a starting room in range
            initial_room = c;
        }
    }
    
}
