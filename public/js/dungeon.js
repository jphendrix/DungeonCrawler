Number.prototype.throwDice = function() {
   return Math.floor( (Math.random() * Math.floor(this.valueOf())) )+1;
};


let dungeon = {
    $events:$({}),
    map:{
        initialize: function(){
            
            dungeon.map.rooms = []; //Clear everything out.
            
            //roll dice to get initial room
            let room = dungeon.map.configs.starting_area.get();
            
            $(dungeon.$events).trigger("map.ready");
    
            room.location = [{x:0,y:0}]; //top-left
            room.location.push({x: room.location[0].x + room.width,  y:room.location[0].y            })  //top-right
            room.location.push({x: room.location[0].x + room.width,  y:room.location[0].y+room.length})  //bottom-right
            room.location.push({x: room.location[0].x,               y:room.location[0].y+room.length})  //bottom-left
            
            room.id = 0;
            room.exists = true;
            
            dungeon.map.rooms.push(room);
            
            $(dungeon.$events).trigger("room.added",room);
            
            for(let i=0; i<room.paths.length; i++){
                dungeon.map.buildRoom(room.id,room.paths[i]);
            }
        },
        info: function(room_id){
            let room = dungeon.map.rooms[room_id];
            let description = `room id:${room_id} is at cordinates ${room.location[0].x},${room.location[0].y}. ${room.description}.  the room is a ${room.width}x${room.length} ${room.shape}.  there are ${room.paths.length} paths of travel`;

            for(let i=0; i<room.paths.length; i++){
                description += `\none may travel ${room.paths[i].direction} via a ${room.paths[i].type} to room id: ${room.paths[i].destination}`
            }
                
            if(room.paths.length==1){
                description += '\nthis room is a dead end.';
            }
            
            
            console.log(description);
          
        },
        buildRoom: function(from_room_id,path){
            let padding = 1;
            
            let origin = dungeon.map.rooms[from_room_id];
            
            //TODO: throw dice to get room 
            let room = {type:path.type,shape:'square',width:50,length:50,paths:[{type:path.type,destination:from_room_id}],description:'room has not been described'}; 
            
            //Get the origin's wall line and calc this room's top-left
            let connecting_wall = [];
            switch(path.direction){
                case "north":
                    connecting_wall = [origin.location[0],origin.location[1]];
                    
                    //same x, shift y to the north
                    room.location = [{x:connecting_wall[0].x,y:connecting_wall[0].y - room.length - padding}];
                    room.paths[0].direction = 'south';
                    break;
                case "south":
                    connecting_wall = [origin.location[3],origin.location[2]];
                    
                    //same x, shift y to the south
                    room.location = [{x:connecting_wall[0].x,y:connecting_wall[0].y+padding}];
                    room.paths[0].direction = 'north';
                    break;
                case "east":
                    connecting_wall = [origin.location[1],origin.location[2]];
                    
                    //same y, shift x to the east
                    room.location = [{x:connecting_wall[0].x+padding,y:connecting_wall[0].y}];
                    room.paths[0].direction = 'west';
                    break;
                case "west":
                    connecting_wall = [origin.location[0],origin.location[3]];
                    
                    //same y, shift x to the west
                    room.location = [{x:connecting_wall[0].x-room.width-padding,y:connecting_wall[0].y}];
                    room.paths[0].direction = 'east';
                    break;
            }
            
            //ToDo: is this room already defined?  Check to see if this room over lays another.  If so, merge the too rooms
            
            //Now that we know the top-left position, we can calc the other points based on width & length
            room.location.push({x: room.location[0].x+room.width,  y:room.location[0].y            });//top-right
            room.location.push({x: room.location[0].x+room.width,  y:room.location[0].y+room.length});//bottom-right
            room.location.push({x: room.location[0].x,             y:room.location[0].y+room.length});//bottom-left
            
            room.id = dungeon.map.rooms.length;
            path.destination = room.id;
            dungeon.map.rooms.push(room);
            
            $(dungeon.$events).trigger("room.added",room);
        },
        rooms:[],
        configs:{
            starting_area:{
                get: function(){
                    let d10 = (10).throwDice();
                    
                    for(let i=1; i<d10; i++){
                        let c = dungeon.map.configs.starting_area.configurations[i];
                        
                        if(d10 >= c.min && d10 <= c.max){
                            //We found a starting room in range
                            return c.room;
                        }
                    }                    
                },
                configurations:[
                    {min:1, max:1,  room:{type:'room',shape:'square',     width:20,length:20,paths:[{direction:'north',type:'passage'},{direction:'south',type:'passage'},{direction:'east',type:'passage'},{direction:'west',type:'passage'}],description:'passage on each wall'}},
                    {min:2, max:2,  room:{type:'room',shape:'square',     width:20,length:20,paths:[{direction:'north',type:'passage'},                                   {direction:'east',type:'door'   },{direction:'west',type:'door'   }],description:'door on two walls, passage on thrid wall'}},
                    {min:3, max:3,  room:{type:'room',shape:'square',     width:40,length:40,paths:[{direction:'north',type:'door'   },{direction:'south',type:'door'   },{direction:'east',type:'door'   }                                  ],description:'doors on three walls'}},
                    {min:4, max:4,  room:{type:'room',shape:'rectangle',  width:80,length:20,paths:[{direction:'north',type:'passage'},{direction:'south',type:'passage'},{direction:'east',type:'door'   },{direction:'west',type:'door'   }],description:'row of pillers down the middle, two passages on long walls, one door on each short wall'}},
                    {min:5, max:8,  room:{type:'room',shape:'rectangle',  width:20,length:40,paths:[{direction:'north',type:'passage'},{direction:'south',type:'passage'},{direction:'east',type:'passage'},{direction:'west',type:'passage'}],description:'passage on each wall'}},
                    {min:9, max:9,  room:{type:'room',shape:'passage',    width:10,length:30,paths:[{direction:'north',type:'passage'},                                   {direction:'east',type:'passage'},{direction:'west',type:'passage'}],description:'T intersection'}},
                    {min:10,max:10, room:{type:'room',shape:'passage',    width:10,length:50,paths:[{direction:'north',type:'passage'},{direction:'south',type:'passage'},{direction:'east',type:'passage'},{direction:'west',type:'passage'}],description:'four-way intersection'}}
                    
                    //TODO: after we learn to draw circle rooms
                    //{min:6,max:6, room:{shape:'circle',width:40,length:40,description:'one passage at each cardinal direction'}}
                    //{min:7,max:7, room:{shape:'circle',width:40,length:40,description:'one passage at each cardinal direction, well in center(may lead to lower level eventually)'}}
                    
                    //TODO: how do you draw secret doors?  How is there a passage and door on the same side?
                    //{min:8, max:8,room:{shape:'square',width:20,length:20,passages:['east'],doors:['north','south','east','west'],secret_doors:['east'],description:'door on two walls, passage on third, secret door on fourth'}},
                ]   
            }
        }
    }
};

$(function(){
    
    
    dungeon.map.initialize();

    dungeon.$events.on("map.ready",function(ev,room){
        drawGrid(800,800);
    });
    
    dungeon.$events.on("room.added",function(ev,room){
        drawRoom(room);
    });
    
})

