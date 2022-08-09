let canvas = document.getElementById('graph-canvas');
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mouseleave', mouseLeave);

/*      Browser interface of graph  */
let graphInterface = new GraphInterface(canvas);

/*      Graph     */
let graph = new Graph();
graph.setBlocks(graphInterface.getNormalOffsetX(), graphInterface.getNormalOffsetY());

window.onload = function () {
    graphInterface.updateDraw();
};

function mouseLeave() {
    graph.currentPointOnCurve = null;
}

function pressControlPoint() {
    //graphCanvas.removeEventListener('click', addBezier);
    document.addEventListener('mousemove', moveControlPoint);
    document.addEventListener('mouseup', upControlPoint);
}

function moveControlPoint(event) {
    let nMousePos = graphInterface.getNormalMousePos(event);
    nMousePos.radius = graphInterface.controlRadius / graphInterface.width;
    graph.moveControlPoint(nMousePos);
    graphInterface.updateDraw();
}

function upControlPoint() {
    graph.currentControlPoint = null;
    graph.currentBezierCurve = null;
    graph.updateBezier();
    document.removeEventListener('mousemove', moveControlPoint);
    document.removeEventListener("mousedown", pressControlPoint);
}

function pressStatePoint() {
    document.addEventListener('mousemove', moveStatePoint);
    document.addEventListener('mouseup', upStatePoint);
}

function moveStatePoint(event) {
    let nMousePos = graphInterface.getNormalMousePos(event);
    nMousePos.radius = graphInterface.statePointRadius / graphInterface.width;
    graph.moveStatePoint(nMousePos);
    graphInterface.updateDraw();
}

function upStatePoint() {
    graph.currentStatePoint = null;
    graph.currentBezierCurve = null;
    graph.updateBezier();
    document.removeEventListener('mousemove', moveStatePoint);
    document.removeEventListener("mousedown", pressStatePoint);
}

function splitBezier(event) {
    graph.splitBezier();
    graphInterface.updateDraw();
}

function mouseMove(event) {
    let nMousePos = graphInterface.getNormalMousePos(event);

    nMousePos.trigger = graphInterface.controlTrigger / graphInterface.width;
    let control = graph.getControlOverPoint(nMousePos);
    if (control) {
        graphInterface.cursorPointer();
        graph.currentControlPoint = control.point;
        graph.currentBezierCurve = control.bezier;
        graph.currentPointOnCurve = null;
        graphInterface.updateDraw();
        document.addEventListener('mousedown', pressControlPoint);
        return;
    } else {
        document.removeEventListener("mousedown", pressControlPoint);
        graphInterface.cursorDefault();
    }

    nMousePos.trigger = graphInterface.statePointTrigger / graphInterface.width;
    let statePoint = graph.getStateOverPoint(nMousePos);
    if (statePoint) {
        graphInterface.cursorPointer();
        graph.currentStatePoint = statePoint.point;
        graph.currentBezierCurve = statePoint.bezier;
        graph.currentPointOnCurve = null;
        graphInterface.updateDraw();

        if (graph.getExtremeStatePoints().indexOf(statePoint.point) == -1)
            document.addEventListener('mousedown', pressStatePoint);
        return;
    } else {
        graphInterface.cursorDefault();
        document.removeEventListener("mousedown", pressStatePoint);
    }

    let pointOnCurve = graph.getClosestPointToCurve(nMousePos);
    if (pointOnCurve && pointOnCurve.d < graphInterface.getNormaValue(12)) {
        graphInterface.cursorPointer();
        graph.currentPointOnCurve = pointOnCurve;
        graphInterface.updateDraw();
        document.addEventListener('click', splitBezier);
        //console.log('on curve');

        return;
    } else {
        //console.log('out curve');
        document.removeEventListener('click', splitBezier);
        graph.currentPointOnCurve = null;
        //graph.currentBezierCurve = null;
        graphInterface.updateDraw();
        graphInterface.cursorDefault();
    }
}