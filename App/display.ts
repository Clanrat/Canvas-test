import * as d3 from 'd3';


interface ILatestTransform{
    x : number;
    y : number;
    k : number;
    shouldUse : boolean;
}
export class Display {
    
    private readonly context : CanvasRenderingContext2D;
    private readonly dataContainer : d3.Selection<any,any,any,any>;
    private scalingFactor : IVector2 = {x : 1, y : 1};
    private latestTransform : ILatestTransform = {x : 0, y : 0, k : 0, shouldUse : false}
    private isFirstMessage : boolean = true;
    private maxCoords : IVector2 = {x : 0, y : 0}
    private minCoords : IVector2 = {x : 0, y : 0}
    private zoomBehaviour : d3.ZoomBehavior<any,any>;
    private dims : {height : number, width : number} = {height : 500, width : 500}
    /**
     *
     */
    constructor(private readonly canvas : HTMLCanvasElement, dims : {height : number, width : number}) {
        this.dims = dims;
        
        this.zoomBehaviour = d3.zoom().on('zoom', () => this.zoom());
        d3.select(canvas).attr('height', dims.height).attr('width', dims.width).call(this.zoomBehaviour);
       this.context = canvas.getContext('2d');
        this.dataContainer = d3.select(document.createElement('custom'));
    }

    private zoom(){
        //this.context.save();
        this.latestTransform = {x : d3.event.transform.x, y : d3.event.transform.y, k : d3.event.transform.k, shouldUse : true};

        //this.context.restore();
    }
    public update(gameState : IHexagonGameState){

        if(this.isFirstMessage){
            const xCoords = gameState.cells.map(c => c.location.x);
            const yCoords = gameState.cells.map(c => c.location.y);
            this.minCoords = {
                x : Math.min(...xCoords),
                y : Math.min(...yCoords)
            }

            this.maxCoords = {
                x : Math.max(...xCoords),
                y : Math.max(...yCoords)
            }
        }


        const dataBinding = this.dataContainer.selectAll('hexagon').data(gameState.cells.map((c) : IHexData => {
            const pos = this.calculateCellPosition(c.location.x, c.location.y);
            return {
                x: pos.x,
                y : pos.y,
                color : c.ownedBy != null ? gameState.players[c.ownedBy].color : '#9e9e9e',
                playerId : c.ownedBy,
                resources : c.resources
            }
        }));

        const dataEnter = dataBinding.enter().append('hexagon');
        dataBinding.exit().remove();
        
        dataBinding.merge(dataEnter)
        .attr('x', d => d.x)
        .attr('y', d=>d.y)
        .attr('color', d=>d.color)
        .attr('resources', d=> d.resources);

        

    }

    public newPlayerCount(){
        this.isFirstMessage = true;
        this.latestTransform.shouldUse = true;
        this.latestTransform.k = 1;
        this.latestTransform.x = 0;
        this.latestTransform.y = 0
    }


    private setInitialZoom(){
        const bbox : {height : number, width : number} = {
            width : (this.maxCoords.x - this.minCoords.x) * hexagonDims.width,
            height : (this.maxCoords.y - this.minCoords.y) * hexagonDims.height
        }

        if(bbox.height === 0 || bbox.width === 0){
            return;
        }

        let scalingFactor = this.dims.height <=  this.dims.width ? this.dims.height / bbox.height : this.dims.width / bbox.width;
        scalingFactor *= 0.8;
        const scaleTransform = d3.zoomIdentity.scale(scalingFactor);
        const totalTransform = scaleTransform.translate(0, 0);

        this.zoomBehaviour.transform( d3.select(this.canvas),totalTransform);
    }

    public draw(){
        this.context.clearRect(0,0, this.dims.width, this.dims.height);
        this.context.save();
        if(this.isFirstMessage){
            this.setInitialZoom();
            this.isFirstMessage = false;
        }

        if(this.latestTransform.shouldUse){
            this.context.translate(this.latestTransform.x, this.latestTransform.y)
            this.context.scale(this.latestTransform.k, this.latestTransform.k);
        }

        var dataElements = this.dataContainer.selectAll('hexagon');
        const ctx = this.context;
        ctx.font = '11pt Arial'
        
        dataElements.each(function(d){
            const node = d3.select(this);

            ctx.beginPath();
            ctx.fillStyle = node.attr('color');
            const pos = {x : +node.attr('x'), y : +node.attr('y')};

            ctx.moveTo(pos.x + hexagonPoints[0][0], pos.y + hexagonPoints[0][1]);
            
            for (var index = 1; index < hexagonPoints.length; index++) {
                var point = hexagonPoints[index];
                ctx.lineTo(pos.x + point[0], pos.y + point[1]);
                
            }
            ctx.lineTo(pos.x + hexagonPoints[0][0], pos.y + hexagonPoints[0][1]);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.fillText(node.attr('resources'), pos.x + 10, pos.y + 20);


        });
        
        this.context.restore();
    }

    

    private calculateCellPosition(x : number, y: number) : IVector2{
        return {
            x: x * 30 * this.scalingFactor.x,
            y: ((x % 2 ? y * 30 + 15 : y * 30) + 15) * this.scalingFactor.y 
        };
    }
}


const hexagonDims : {height : number, width : number} = {
    width : 2 * 15, height : Math.sqrt(3) * 15
}


const hexagonPoints = [[0,15], [10,0], [30, 0], [40,15], [30, 30], [10, 30]];

interface IHexData{
    x : number;
    y : number;
    color : string;
    resources : number;
    playerId? : number;
}

export interface IHexagonGameState{
    cells : ICellSnapshot[];
    players : {[id:number] : IPlayer}
}

export interface ICellSnapshot{
    ownedBy? : number;
    resources : number;
    location : IVector2;
}

export interface IPlayer{
    id: number;
    color : string;
}

export interface IVector2{
    x : number;
    y : number;
}