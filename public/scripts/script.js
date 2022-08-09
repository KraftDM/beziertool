
let btn = document.getElementById('scriptRun');
document.addEventListener("DOMContentLoaded", ready);
function ready(event) {
      btn.addEventListener('click', runScript5);
}

async function runScript1(event) {
    let bezier = graph.bezierList[0],
        p1 = bezier.points[1],
        p2 = bezier.points[2];

    let p1e = new Point(0.5, 1);
    let p2e = new Point(0.5, 0);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    p1e = new Point(0, 0.5);
    p2e = new Point(1, 0.5);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    p1e = new Point(0.3, 1);
    p2e = new Point(0.6, 0.85);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    p1e = new Point(0, 0.35);
    p2e = new Point(0.35, 0);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    p1e = new Point(0.25, 0.75);
    p2e = new Point(0.75, 0.25);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
}

async function runScript2() {
    let bezier = graph.bezierList[0],
        p1 = bezier.points[1],
        p2 = bezier.points[2];
    await sleep(350);
    let p1e = new Point(0.25, 1);
    let p2e = new Point(0.75, 0);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    let point = new Point(0.5,0.5);
    point.bezier = bezier;
    point.t = 0.5;
    graph.currentPointOnCurve = point;
    splitBezier();
    await sleep(350);
    let newPoint = new Point(0.25, 0.25);
    for(let i = 0; i < 1; i+=0.05){
        let y  = (1-i)*point.y + i * newPoint.y;
        let x  = (1-i)*point.x + i * newPoint.x;
        graph.currentStatePoint = point;
        graph.currentBezierCurve = graph.bezierList[0];
        graph.moveStatePoint(new Point(x , y));
        await sleep(40);
        graphInterface.updateDraw();
    }
    p2e = new Point(0.65, 0.35);
    let p = graph.bezierList[1].points[2];
    await sleep(350);
    for(let i = 0; i < 1; i+=0.05){
        p.y  = (1-i)*p.y + i * p2e.y;
        p.x  = (1-i)*p.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
}

async function runScript3() {
    await sleep(900);
    let bezier = graph.bezierList[0],
        p1 = bezier.points[1],
        p2 = bezier.points[2];
    let p1e = new Point(0.25, 1);
    let p2e = new Point(0.75, 0);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    let newbtn = canvasTools[0];
    let text = newbtn.getElementsByClassName('tool-text')[0];
    text.style.width = getLength(text.innerText) + 10 + 'px';


    await sleep(900);
    newbtn.click();
    text.style.width = '0';
    await sleep(350);
    bezier = graph.bezierList[0],
        p1 = bezier.points[1],
        p2 = bezier.points[2];
    p1e = new Point(0, 0.75);
    p2e = new Point(1, 0.25);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }

    await sleep(900);
    let comparebtn = canvasTools[2];
    let ctext = comparebtn.getElementsByClassName('tool-text')[0];
    ctext.style.width = getLength(ctext.innerText) + 10 + 'px';

    await sleep(750);
    comparebtn.click();
    ctext.style.width = '0';

    await sleep(900);
    let playbtn = tools[0];
    let ptext = playbtn.getElementsByClassName('tool-text')[0];
    ptext.style.width = getLength(ptext.innerText) + 10 + 'px';

    await sleep(750);
    playbtn.click();
    ptext.style.width = '0';

}


async function runScript4() {

    let bezier = graph.bezierList[0],
        p1 = bezier.points[1],
        p2 = bezier.points[2];
    await sleep(350);
    let p1e = new Point(0.25, 1);
    let p2e = new Point(0.75, 0);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    let point = new Point(0.5,0.5);
    point.bezier = bezier;
    point.t = 0.5;
    graph.currentPointOnCurve = point;
    splitBezier();
    await sleep(350);
    let newPoint = new Point(0.25, 0.25);
    for(let i = 0; i < 1; i+=0.05){
        let y  = (1-i)*point.y + i * newPoint.y;
        let x  = (1-i)*point.x + i * newPoint.x;
        graph.currentStatePoint = point;
        graph.currentBezierCurve = graph.bezierList[0];
        graph.moveStatePoint(new Point(x , y));
        await sleep(40);
        graphInterface.updateDraw();
    }
    p2e = new Point(0.65, 0.35);
    let p = graph.bezierList[1].points[2];
    await sleep(350);
    for(let i = 0; i < 1; i+=0.05){
        p.y  = (1-i)*p.y + i * p2e.y;
        p.x  = (1-i)*p.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }


    await sleep(900);
    let rtext = refreshCodeBtn.getElementsByClassName('tool-text')[0];
    rtext.style.width = getLength(rtext.innerText) + 10 + 'px';

    await sleep(750);
    refreshCodeBtn.click();
    rtext.style.width = '0';
}

async function runScript5() {
    let bezier = graph.bezierList[0];
    let ctx = graphInterface.context;
    for(let k=1; k < 10; k+=1){
    ctx.restore();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#E04F5F';
    let pp = bezier.compute(0);
    ctx.moveTo(pp.x*graphInterface.width +  graphInterface.offsetX, pp.y*graphInterface.height + graphInterface.offsetY);
    for(let i = 0; i < 1; i+=(1/k)){
        let p = bezier.compute(i);
        ctx.beginPath();
        ctx.moveTo(pp.x*graphInterface.width +  graphInterface.offsetX, pp.y*graphInterface.height + graphInterface.offsetY);
        ctx.lineTo(p.x*graphInterface.width + graphInterface.offsetX, p.y*graphInterface.height + graphInterface.offsetY);
        ctx.stroke();
        pp = p;
    }
    ctx.moveTo(pp.x*graphInterface.width +  graphInterface.offsetX, pp.y*graphInterface.height + graphInterface.offsetY);
    ctx.lineTo(1*graphInterface.width + graphInterface.offsetX, 0*graphInterface.height + graphInterface.offsetY);
        ctx.stroke();
    ctx.closePath();
    ctx.restore();
    await sleep(500);
    graphInterface.updateDraw();
    }
}



async function runScript6() {
    await sleep(900);
    let bezier = graph.bezierList[0],
        p1 = bezier.points[1],
        p2 = bezier.points[2];
    let p1e = new Point(0.25, 1);
    let p2e = new Point(0.75, 0);
    for(let i = 0; i < 1; i+=0.05){
        p1.y = (1-i)*p1.y + i * p1e.y;
        p1.x = (1-i)*p1.x + i * p1e.x;
        p2.y = (1-i)*p2.y + i * p2e.y;
        p2.x = (1-i)*p2.x + i * p2e.x;
        await sleep(40);
        graphInterface.updateDraw();
    }
    await sleep(350);
    let newbtn = canvasTools[1];
    let text = newbtn.getElementsByClassName('tool-text')[0];
    text.style.width = getLength(text.innerText) + 10 + 'px';

    await sleep(900);
    newbtn.click();
    text.style.width = '0';

    await sleep(900);
    let rtext = refreshArchiveBtn.getElementsByClassName('tool-text')[0];
    rtext.style.width = getLength(rtext.innerText) + 10 + 'px';

    await sleep(750);
    refreshArchiveBtn.click();
    rtext.style.width = '0';
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}
