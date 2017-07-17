(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["main"] = factory();
	else
		root["Test"] = root["Test"] || {}, root["Test"]["main"] = factory();
})(this, function() {
return webpackJsonpTest__name_([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const display_1 = __webpack_require__(1);
window.addEventListener('load', () => {
    let playerCounts = 25;
    let fps = 25;
    let fpsInterval = 1000 / fps;
    createEverything(playerCounts);
    const displays = [new display_1.Display(document.getElementById('cnvs'), { height: 500, width: 500 }),
        new display_1.Display(document.getElementById('cnvs2'), { height: 500, width: 500 }),
        new display_1.Display(document.getElementById('cnvs3'), { height: 500, width: 500 }),
        new display_1.Display(document.getElementById('cnvs4'), { height: 500, width: 500 })];
    document.getElementById('playerCount').addEventListener('keyup', (e) => {
        var value = +document.getElementById('playerCount').value;
        if (value >= 1) {
            displays.forEach(d => {
                d.newPlayerCount();
            });
            playerCounts = value;
            createEverything(playerCounts);
        }
    });
    document.getElementById('fps').addEventListener('keyup', (e) => {
        var value = +document.getElementById('fps').value;
        if (value >= 1) {
            fps = value;
            fpsInterval = 1000 / fps;
        }
    });
    const update = () => {
        const now = Date.now();
        const elapsed = now - then;
        displays.forEach(d => {
            d.update(getRandomBoard(playerCounts));
            if (elapsed > fpsInterval) {
                d.draw();
                then = now - (elapsed % fpsInterval);
            }
        });
        window.requestAnimationFrame(update);
    };
    let then = Date.now();
    let startTime = then;
    update();
});
let startLocations;
let board;
const createEverything = (playerCount) => {
    for (let i = 0; i < playerCount; i++) {
        players[i] = {
            id: i,
            color: getRandomColor()
        };
    }
    startLocations = getStartLocations(playerCount);
    const furthestPlayer = furthestPoint();
    for (let i = 0; i < startLocations.length; i++) {
        startLocations[i].x + furthestPlayer;
        startLocations[i].y + furthestPlayer;
    }
    board = buildBoard();
};
const buildBoard = () => {
    const cells = [];
    let furest = furthestPoint();
    let negativeFurthest = furest;
    let positiveFurthest = furest;
    for (let i = 0; i <= furest; i++) {
        for (let j = -negativeFurthest; j <= positiveFurthest; j++) {
            if (i !== 0) {
                cells.push({
                    location: { x: -i + furest, y: j + furest },
                    resources: 0,
                    ownedBy: null
                });
            }
            cells.push({
                location: { x: i + furest, y: j + furest },
                resources: 0,
                ownedBy: null
            });
        }
        if (i % 2 === furest % 2) {
            positiveFurthest--;
        }
        else {
            negativeFurthest--;
        }
    }
    return cells;
};
const getStartLocations = (areaCount) => {
    const locationArray = Array(areaCount);
    locationArray[0] = { x: 0, y: 0 };
    for (var index = 1; index < areaCount; index++) {
        locationArray[index] = getNextBestLocation(locationArray);
    }
    return locationArray;
};
const getNextBestLocation = (locationArray) => {
    const nonZeroCounts = locationArray.filter(l => l.x !== 0 && l.y !== 0).length;
    for (let i = 0; i <= nonZeroCounts; i++) {
        let startingLocation = locationArray[i];
        for (let j = 0; j < layoutCoordinates.length; j++) {
            const currentlyAvailableLocation = getNextAvailableCoordinate(startingLocation, locationArray);
            if (currentlyAvailableLocation.x !== 0 && currentlyAvailableLocation.y !== 0) {
                return currentlyAvailableLocation;
            }
        }
    }
    return getNextBestLocation(locationArray);
};
const getNextAvailableCoordinate = (startingPoint, locationArray) => {
    let result = { x: 0, y: 0 };
    for (let i = 0; i < 6; i++) {
        if (locationArray.filter(p => p.x === startingPoint.x + layoutCoordinates[i].x && p.y === startingPoint.y + layoutCoordinates[i].y).length < 1) {
            result = { x: startingPoint.x + layoutCoordinates[i].x, y: startingPoint.y + layoutCoordinates[i].y };
        }
    }
    return result;
};
const layoutCoordinates = [
    { x: 0, y: -4 },
    { x: -4, y: -2 },
    { x: 4, y: -2 },
    { x: 0, y: 4 },
    { x: 4, y: 2 },
    { x: -4, y: 2 },
];
let players = {};
const getRandomBoard = (playerCount) => {
    board.forEach((c, i) => {
        c.ownedBy = Math.floor(Math.random() * playerCount),
            c.resources = Math.round(Math.random() * 100);
    });
    return {
        cells: board,
        players: players
    };
};
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const furthestPoint = () => {
    const xCoords = startLocations.map(l => l.x);
    const yCoords = startLocations.map(l => l.y);
    return Math.max(...[
        Math.abs(Math.max(...yCoords) - startLocations[0].y),
        Math.abs(Math.min(...yCoords) - startLocations[0].y),
        Math.abs(Math.max(...xCoords) - startLocations[0].x),
        Math.abs(Math.min(...xCoords) - startLocations[0].x),
    ]) + 2;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(2);
class Display {
    /**
     *
     */
    constructor(canvas, dims) {
        this.canvas = canvas;
        this.scalingFactor = { x: 1, y: 1 };
        this.latestTransform = { x: 0, y: 0, k: 0, shouldUse: false };
        this.isFirstMessage = true;
        this.maxCoords = { x: 0, y: 0 };
        this.minCoords = { x: 0, y: 0 };
        this.dims = { height: 500, width: 500 };
        this.dims = dims;
        this.zoomBehaviour = d3.zoom().on('zoom', () => this.zoom());
        d3.select(canvas).attr('height', dims.height).attr('width', dims.width).call(this.zoomBehaviour);
        this.context = canvas.getContext('2d');
        this.dataContainer = d3.select(document.createElement('custom'));
    }
    zoom() {
        //this.context.save();
        this.latestTransform = { x: d3.event.transform.x, y: d3.event.transform.y, k: d3.event.transform.k, shouldUse: true };
        //this.context.restore();
    }
    update(gameState) {
        if (this.isFirstMessage) {
            const xCoords = gameState.cells.map(c => c.location.x);
            const yCoords = gameState.cells.map(c => c.location.y);
            this.minCoords = {
                x: Math.min(...xCoords),
                y: Math.min(...yCoords)
            };
            this.maxCoords = {
                x: Math.max(...xCoords),
                y: Math.max(...yCoords)
            };
        }
        const dataBinding = this.dataContainer.selectAll('hexagon').data(gameState.cells.map((c) => {
            const pos = this.calculateCellPosition(c.location.x, c.location.y);
            return {
                x: pos.x,
                y: pos.y,
                color: c.ownedBy != null ? gameState.players[c.ownedBy].color : '#9e9e9e',
                playerId: c.ownedBy,
                resources: c.resources
            };
        }));
        const dataEnter = dataBinding.enter().append('hexagon');
        dataBinding.exit().remove();
        dataBinding.merge(dataEnter)
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('color', d => d.color)
            .attr('resources', d => d.resources);
    }
    newPlayerCount() {
        this.isFirstMessage = true;
        this.latestTransform.shouldUse = true;
        this.latestTransform.k = 1;
        this.latestTransform.x = 0;
        this.latestTransform.y = 0;
    }
    setInitialZoom() {
        const bbox = {
            width: (this.maxCoords.x - this.minCoords.x) * hexagonDims.width,
            height: (this.maxCoords.y - this.minCoords.y) * hexagonDims.height
        };
        if (bbox.height === 0 || bbox.width === 0) {
            return;
        }
        let scalingFactor = this.dims.height <= this.dims.width ? this.dims.height / bbox.height : this.dims.width / bbox.width;
        scalingFactor *= 0.8;
        const scaleTransform = d3.zoomIdentity.scale(scalingFactor);
        const totalTransform = scaleTransform.translate(0, 0);
        this.zoomBehaviour.transform(d3.select(this.canvas), totalTransform);
    }
    draw() {
        this.context.clearRect(0, 0, this.dims.width, this.dims.height);
        this.context.save();
        if (this.isFirstMessage) {
            this.setInitialZoom();
            this.isFirstMessage = false;
        }
        if (this.latestTransform.shouldUse) {
            this.context.translate(this.latestTransform.x, this.latestTransform.y);
            this.context.scale(this.latestTransform.k, this.latestTransform.k);
        }
        var dataElements = this.dataContainer.selectAll('hexagon');
        const ctx = this.context;
        ctx.font = '11pt Arial';
        dataElements.each(function (d) {
            const node = d3.select(this);
            ctx.beginPath();
            ctx.fillStyle = node.attr('color');
            const pos = { x: +node.attr('x'), y: +node.attr('y') };
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
    calculateCellPosition(x, y) {
        return {
            x: x * 30 * this.scalingFactor.x,
            y: ((x % 2 ? y * 30 + 15 : y * 30) + 15) * this.scalingFactor.y
        };
    }
}
exports.Display = Display;
const hexagonDims = {
    width: 2 * 15, height: Math.sqrt(3) * 15
};
const hexagonPoints = [[0, 15], [10, 0], [30, 0], [40, 15], [30, 30], [10, 30]];


/***/ })
],[0]);
});
//# sourceMappingURL=Test.main.map