import {Display , IHexagonGameState, IVector2, ICellSnapshot, IPlayer} from './display';




window.addEventListener('load', () => {
    let playerCounts = 25;
    let fps = 25;
    let fpsInterval = 1000/fps;



    createEverything(playerCounts);
    const displays = [new Display(document.getElementById('cnvs') as HTMLCanvasElement, {height: 500, width: 500}),
    new Display(document.getElementById('cnvs2') as HTMLCanvasElement, {height: 500, width: 500}),
    new Display(document.getElementById('cnvs3') as HTMLCanvasElement, {height: 500, width: 500}),
    new Display(document.getElementById('cnvs4') as HTMLCanvasElement, {height: 500, width: 500})];

    document.getElementById('playerCount').addEventListener('keyup', (e) => {
        var value = +(document.getElementById('playerCount') as HTMLInputElement).value;
        if(value >= 1){
            displays.forEach(d => {
                d.newPlayerCount();
            })
            playerCounts = value;

            createEverything(playerCounts);
            
        }

    })

    document.getElementById('fps').addEventListener('keyup' ,(e) => {
        var value = +(document.getElementById('fps') as HTMLInputElement).value;
        if(value >= 1){

            fps = value;
            fpsInterval = 1000/fps;


            
        }
    })

    const update = () => {
        const now = Date.now();
        const elapsed = now - then;

        displays.forEach(d => {
            d.update(getRandomBoard(playerCounts));
            if(elapsed > fpsInterval){
                d.draw();
                then = now - (elapsed % fpsInterval);
            }
        });


        window.requestAnimationFrame(update);
    }

    let then = Date.now();
    let startTime = then;

    update();
    
});


let startLocations : IVector2[];
let board : ICellSnapshot[];
const createEverything = (playerCount : number) => {
        for(let i = 0 ; i < playerCount ; i++){
        players[i] = {
            id : i,
            color : getRandomColor()
        };
    }


    startLocations = getStartLocations(playerCount);
    const furthestPlayer = furthestPoint();
    for(let i = 0 ; i < startLocations.length ; i++){
        startLocations[i].x + furthestPlayer;
        startLocations[i].y + furthestPlayer;
    }

    board = buildBoard()
}

const buildBoard = () : ICellSnapshot[]=> {
    const cells : ICellSnapshot[] = [];
    let furest = furthestPoint();
    let negativeFurthest = furest;
    let positiveFurthest = furest;

    for(let i = 0 ; i <= furest ; i++){
        for(let j = -negativeFurthest; j <= positiveFurthest; j++){
            if(i !== 0){
                cells.push({
                    location : {x : -i + furest,y : j + furest},
                    resources : 0,
                    ownedBy : null
                });

            }

            cells.push({
                location : {x : i + furest, y : j + furest},
                resources : 0,
                ownedBy : null
            });
        }
        if(i % 2 === furest % 2){
            positiveFurthest--;
        }
        else{
            negativeFurthest--;
        }
    }

    return cells;
} 


const getStartLocations = (areaCount : number) : IVector2[] => {
    const locationArray : IVector2[]= Array(areaCount);

    locationArray[0] = {x : 0, y : 0}

    for (var index = 1; index < areaCount; index++) {
        locationArray[index] = getNextBestLocation(locationArray);
        
    }

    return locationArray;
}

const getNextBestLocation = (locationArray : IVector2[]) : IVector2  => {
    const nonZeroCounts = locationArray.filter(l => l.x !== 0 && l.y !== 0).length;
    for(let i = 0 ; i <= nonZeroCounts ; i++){
        let startingLocation = locationArray[i];
        for(let j = 0 ; j < layoutCoordinates.length ; j++){
            const currentlyAvailableLocation = getNextAvailableCoordinate(startingLocation, locationArray);
            if(currentlyAvailableLocation.x !== 0 && currentlyAvailableLocation.y !== 0){
                return currentlyAvailableLocation;
            }
        }
    }

    return getNextBestLocation(locationArray);
}

const getNextAvailableCoordinate = (startingPoint : IVector2, locationArray : IVector2[]) : IVector2 => {
    let result : IVector2 = {x : 0, y : 0};
    for(let i = 0; i < 6 ; i++){
        if(locationArray.filter(p => p.x === startingPoint.x + layoutCoordinates[i].x && p.y === startingPoint.y + layoutCoordinates[i].y).length < 1){
            result = {x : startingPoint.x + layoutCoordinates[i].x , y : startingPoint.y + layoutCoordinates[i].y};
        }
    }

    return result;
}


const layoutCoordinates : IVector2[] = [
    {x : 0, y :-4},
    {x : -4, y :-2},
    {x : 4, y :-2},
    {x : 0, y :4},
    {x : 4, y :2},
    {x : -4, y :2},

];
let players : {[id : number] : IPlayer} = {};


const getRandomBoard = (playerCount : number) : IHexagonGameState => {
   



    board.forEach((c, i) => {
        c.ownedBy = Math.floor(Math.random() * playerCount),
        c.resources = Math.round(Math.random() * 100)
    });

    return {
        cells : board,
        players : players
    };

    
    
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const furthestPoint = () : number => {
    const xCoords = startLocations.map(l => l.x);
    const yCoords = startLocations.map(l => l.y);


    return Math.max(...[
        Math.abs(Math.max(...yCoords) - startLocations[0].y),
        Math.abs(Math.min(...yCoords) - startLocations[0].y),
        Math.abs(Math.max(...xCoords) - startLocations[0].x),
        Math.abs(Math.min(...xCoords) - startLocations[0].x),
    ]) + 2;
}