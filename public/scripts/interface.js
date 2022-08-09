function GraphInterface(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.width = 350;
    this.height = 350;
    this.offsetX = (canvas.width  - this.width) / 2;
    this.offsetY = (canvas.height - this.height) / 2;
    this.getNormalOffsetX = function () {
        return this.offsetX / this.width;
    };
    this.getNormalOffsetY = function () {
        return this.offsetY / this.height;
    };

    this.top = 0;
    this.left = 0;
    this.bottom = canvas.height;
    this.right = canvas.width;

    this.color0 = '#415E72';
    this.colors = ['#25B6D2', '#E04F5F', '#ecbd26', '#4db250', '#c48dcf'];

    // background
    this.grid = 4;
    this.gridWidth = 1.5;
    this.gridColor = '#bfbfbf';

    //curve
    this.curveWidth = 4;
    this.curveColor = this.color0;
    this.pointCurveRadius = 5;
    this.pointCurveColor = this.color0;

    // state point
    this.statePointRadius = 5;
    this.statePointColor =  this.color0;
    this.statePointTrigger = 15;

    //controls
    this.controlWidth = 3;
    this.controlRadius = 9;
    this.controlTrigger = 9;

    this.drawBackground = function () {
        this.draw( this.background.bind(this));
    };
    this.drawCurve = function () {
        this.draw( this.curve.bind(this));
    };
    this.drawPoints = function () {
        this.draw( this.statePoints.bind(this));
        //this.draw( this.statePointsTrigger.bind(this));
    };
    this.drawControls = function () {
        this.draw( this.controlsLine.bind(this));
        this.draw( this.controlsPoint.bind(this));
    };
    this.drawPointOnCurve = function () {
        this.draw(this.pointOnCurve.bind(this));
    };
}

GraphInterface.prototype = {
    getMousePos: function(event){
        let x = event.pageX - this.canvas.getBoundingClientRect().left,
            y = event.pageY - this.canvas.getBoundingClientRect().top;
        return new Point(x, y);
    },
    getNormalMousePos: function(event){
        let point  = this.getMousePos(event);
        let x = (point.x - this.offsetX) / this.width,
            y = (point.y - this.offsetY) / this.height;
        return new Point(x, y);
    },
    cursorPointer: function(){
        this.canvas.style.cursor = 'pointer';
    },
    cursorDefault: function(){
        this.canvas.style.cursor = 'default';
    },
    getNormaValue: function(value){
        return value / this.width;
    },
    curve: function () {
        let context = this.context;
        context.lineWidth = this.curveWidth;
        context.strokeStyle = this.curveColor;
        let bezierList = graph.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let bezier = bezierList[i];
            this.moveTo(bezier.points[0]);
            this.bezierCurveTo(
                bezier.points[1].x, bezier.points[1].y,
                bezier.points[2].x, bezier.points[2].y,
                bezier.points[3].x, bezier.points[3].y
            );
        }
        context.stroke();
    },
    statePoints: function(){
        let context = this.context;
        context.fillStyle = this.statePointColor;
        let bezierList = graph.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let bezier = bezierList[i];
            context.beginPath();
            this.arc(bezier.points[0], this.statePointRadius);
            this.arc(bezier.points[3], this.statePointRadius);
            context.closePath();
            context.fill();
        }
    },/*
    statePointsTrigger: function(){
        let context = this.context;
        context.strokeStyle = this.statePointColor;
        context.lineWidth = 1.5;
        context.setLineDash([4, 4]);
        let bezierList = graph.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let bezier = bezierList[i];

            context.beginPath();
            this.arc(bezier.points[0], this.statePointTrigger);
            context.closePath();
            context.stroke();

            context.beginPath();
            this.arc(bezier.points[3], this.statePointTrigger);
            context.closePath();
            context.stroke();
        }
    },*/
    controlsLine: function(){
        let context = this.context;
        context.strokeStyle = this.colors[currentCurve];
        context.lineWidth = this.controlWidth;
        let bezierList = graph.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let bezier = bezierList[i];
            this.moveTo(bezier.points[0]);
            this.lineTo(bezier.points[1]);
            this.moveTo(bezier.points[3]);
            this.lineTo(bezier.points[2]);
        }
        context.stroke();
    },
    controlsPoint: function(){
        let context = this.context;
        context.fillStyle = this.colors[currentCurve];
        let bezierList = graph.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let bezier = bezierList[i];
            context.beginPath();
            this.arc(bezier.points[1], this.controlRadius);
            this.arc(bezier.points[2], this.controlRadius);
            context.closePath();
            context.fill();
        }
    },
    pointOnCurve: function(){
        let context = this.context;
        context.fillStyle = this.pointCurveColor;
        this.arc(graph.currentPointOnCurve, this.pointCurveRadius);
        context.fill();
    },
    background: function () {
        let context = this.context;
        context.strokeStyle = this.gridColor;
        context.lineWidth = this.gridWidth;
        this.rect(0, 0, this.width, this.height);
        for (let i = 1; i < this.grid; i++) {
            let x = i * (1 / this.grid);
            this.moveTo({x: x, y: 0});
            this.lineTo({x: x, y: 1});
        }
        for (let i = 1; i < this.grid; i++) {
            let y = i * (1 / this.grid);
            this.moveTo({x: 0, y: y});
            this.lineTo({x: 1, y: y});
        }
        context.stroke();
    },
    updateDraw: function () {
        let context = this.context;
        context.clearRect(0,0, this.right, this.bottom);
        this.drawBackground();
        this.drawControls();
        this.drawCurve();
        this.drawPoints();
        if(graph.currentPointOnCurve)
            this.drawPointOnCurve();

       /*let list = [];
        for(let i=0; i < graph.bezierList.length; i++) {
            let bezier = graph.bezierList[i];
            let mpf = bezier.extrema();
            for(let j=0; j< mpf.length; j++){
                let t = mpf[j];
                list.push(bezier.compute(t));
            }
        }
        list.forEach(p=> {
            context.save();
            context.beginPath();
            context.fillStyle = "#000";
            this.arc(p, 5);
            context.fill();
            context.closePath();
            context.restore();
        });*/
    },
    draw: function (func) {
        let context = this.context;
        context.save();
        context.beginPath();
        func();
        context.closePath();
        context.restore();
    },
    moveTo: function (point) {
        let context = this.context;
        context.moveTo(this.offsetX + point.x*this.width, this.offsetY + point.y*this.height);
    },
    lineTo: function (point) {
        let context = this.context;
        context.lineTo(this.offsetX + point.x*this.width, this.offsetY + point.y*this.height);
    },
    rect: function (x, y, width, height) {
        let context = this.context;
        context.rect(this.offsetX + x*this.width, this.offsetY + y*this.height, width, height);
    },
    bezierCurveTo: function (cp1x, cp1y, cp2x, cp2y, epx, epy) {
        let context = this.context;
        context.bezierCurveTo(
            this.offsetX + cp1x*this.width, this.offsetY + cp1y*this.height,
            this.offsetX + cp2x*this.width, this.offsetY + cp2y*this.height,
            this.offsetX + epx*this.width, this.offsetY + epy*this.height);
    },
    arc: function (point, radius) {
        let context = this.context;
        context.arc(this.offsetX + point.x*this.width, this.offsetY + point.y*this.height, radius, 0, Math.PI * 2);
    }
};