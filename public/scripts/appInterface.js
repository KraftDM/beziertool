
/*

    Login

 */

let header = document.getElementById('user-header');
window.addEventListener('load',  async function() {
    let user = await checkUser();
    if(!user){
        header.innerHTML = '<a href="\login">Login</a>';
        return;
    }
    header.innerHTML = user.username + '<a href="\logout">Logout</a>';
});

function checkUser() {
    return new Promise(resolve => {
        APIGetJson('/api/user', function (response) {
            resolve(response);
        });
    });
}


/*

    Curves

 */

let Curve = function(name, graph, active){
    this.name = name || 'Custom';
    this.graph = graph;
    this.active = active || false;
};

let previewCurves = [
    //new Curve('Custom 1', graph, true)
];

let currentCurve = -1;

function start (){
    let name = document.getElementById('canvas-curve-name');
    name.innerText = previewCurves[currentCurve].name;
}

let boxes = document.getElementsByClassName('row');
for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i],
        track = box.getElementsByClassName('track')[0];
    track.addEventListener('click', changeCurrentCurve.bind(box));

    let id = box.id.slice(-1);
    let name = box.getElementsByClassName('box-name-text')[0];
    name.innerHTML = previewCurves[id].name;
}

let curvesTabs = document.getElementById('curves-tabs');

let createNewCurveBtn = document.getElementById('create-new');
createNewCurveBtn.addEventListener('click', createCurve);
function createCurve(event) {
    let inPreview = false;
    for(let i=0; i<previewCurves.length; i++){
        let curve = previewCurves[i];
        if(curve.graph == graph && curve.active){
            inPreview = true;
        }
    }
    if(inPreview){
        createNewCurve();
        updateCurrentCurve();
    } else {
        graph = new Graph();
        graph.setBlocks(graphInterface.getNormalOffsetX(), graphInterface.getNormalOffsetY());
        previewCurves[currentCurve].graph = graph;
        updateCurrentCurve();
    }
}

function createNewCurve() {
    graph = new Graph();
    graph.setBlocks(graphInterface.getNormalOffsetX(), graphInterface.getNormalOffsetY());

    if(currentCurve !=-1) {
        let ct = document.getElementById('curve-' + currentCurve);
        ct.children[0].classList.remove('ct-active');
        curvesTabs.children[previewCurves.length - 1].children[0].style.removeProperty('margin');
    }
    currentCurve = previewCurves.length;
    previewCurves.push( new Curve(name, graph));
    curvesTabs.append(createCurveTab(currentCurve));
    refreshCode();
}

function createCurveTab(id) {
    let curveTab = document.createElement('div');
    curveTab.id = 'curve-' + id;
    curveTab.innerHTML = '<div class="curve-tab ct-active" animationHead="margin: 0"></div>';
    curveTab.addEventListener('click', changeCurrentCurve.bind(curveTab));
    return curveTab;
}

let curveSelector = document.getElementById('select-ease');
curveSelector.selectedIndex = 0;
curveSelector.addEventListener('change', changeEase);
async function changeEase() {
    let ease = curveSelector[curveSelector.selectedIndex].value,
        currentGraph = previewCurves[currentCurve].graph;

    if(currentGraph.bezierList.length == 1){
        let states = getStatesAnimationByName(ease);
        let p1e = states.p1,
            p2e = states.p2,
            p1 = currentGraph.bezierList[0].points[1],
            p2 = currentGraph.bezierList[0].points[2];
        for(let i = 0; i < 1; i+=0.05){
            p1.y = (1-i)*p1.y + i * p1e.y;
            p1.x = (1-i)*p1.x + i * p1e.x;
            p2.y = (1-i)*p2.y + i * p2e.y;
            p2.x = (1-i)*p2.x + i * p2e.x;
            await sleep(25);
            graphInterface.updateDraw();
        }
    } else {

    }
}

function getAnimationByName(name) {
    return animationArchive.filter(animation=> animation.name==name)[0];
}

function getStatesAnimationByName(name) {
    return getAnimationByName(name).states;
}

/*

    Main and common

 */

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

function updateCurrentCurve(){
    let name = document.getElementById('canvas-curve-name');
    name.setAttribute('curve-edit', currentCurve);
    name.innerText = previewCurves[currentCurve].name;
    graphInterface.updateDraw();
}

function changeCurrentCurve(event){
    let ctp = document.getElementById('curve-' + currentCurve);
    ctp.children[0].classList.remove('ct-active');
    let id = this.id.slice(-1);
    currentCurve = id;
    refreshCode();
    graph = previewCurves[id].graph;
    let ctn = document.getElementById('curve-' + currentCurve);
    ctn.children[0].classList.add('ct-active');
    updateCurrentCurve();
}

window.onload = function () {
    let code = document.getElementById('code-box');
    code.children[1].value = '';

    createNewCurve();
    addLastCurveToCompare();

    loadArchive();
};

/*

    Compare

 */

let compareCurveBtn = document.getElementById('compare');
compareCurveBtn.addEventListener('click', compareCurve);
function compareCurve(event) {
    let inPreview = false;
    for(let i=0; i<previewCurves.length; i++){
        let curve = previewCurves[i];
        if(curve.graph == graph && curve.active){
            inPreview = true;
        }
    }
    if(inPreview){
    } else {
        addLastCurveToCompare();
    }
}

function addLastCurveToCompare() {
    let name = 'Custom ' + (previewCurves.length);
    previewCurves[previewCurves.length - 1].active = true;
    previewCurves[previewCurves.length - 1].name = name;
    let row  = createNewRow(name);
    updateCurrentCurve();
    document.getElementById('preview').children[0].append(row);
}

function createNewRow(name) {
    let box = document.createElement('div');
    let id = (previewCurves.length - 1);
    box.id = 'box-' + id;
    box.classList.add('row');

    box.innerHTML =
        '<div class="track"><div class="trace"><div class="trace-block"></div><div class="trace-block"></div></div><div class="box-path"><div class="box animation time"></div></div></div>' +
        '<div class="box-name"> <div class="box-name-text">'+ name +'</div> <div class="tool"><div class="tool-icon"><img src="static/tree-dots.svg"></div></div>';

    let track = box.getElementsByClassName('track')[0];
    track.addEventListener('click', changeCurrentCurve.bind(box));
    return box;
}

/*

    Compute animation, and Set animation

 */

let playAnimationBtn = document.getElementById('run');
playAnimationBtn.addEventListener('click', playAnimation);
let animationHead = document.createElement('style');
animationHead.type = 'text/css';
document.head.append(animationHead);

let animationSandboxHead = document.createElement('style');
animationSandboxHead.type = 'text/css';
document.head.append(animationSandboxHead);

let Duration = 0.5,
    DurationString = Duration*1000 + 'ms';
let durationInput = document.getElementById('duration');
durationInput.value = Duration;
let durationTime = document.getElementById('duration-time');
durationInput.oninput = function () {
    let time = durationInput.value;
    if(time < 1)
        DurationString = time*1000 + 'ms';
    else
        DurationString = time + 's';
    Duration = time*1000;
    durationTime.innerText =  DurationString;
};

function setAnimation(){
    let animationString = '';
    for(let i = 0; i < previewCurves.length; i++) {
        let currentGraph = previewCurves[i].graph,
            animation = computeAnimation(currentGraph);
        animationString += '@keyframes key-animation-normal-' + i +' {\n' + animation + '\n}' +
            '\n.time {\n\tanimation-duration: ' + DurationString + ';\n}';
    }
    animationHead.innerHTML = animationString;
}

function computeAnimation(graph, style){
    style = style || 'left';
    let animation = '',
        parts = graph.getPartsOfAnimation();
    for(let i = 0; i < parts.length; i++){
        let part = parts[i],
            string = '';
        if(!isDependentStyle(style))
            string = '\t' + part.time + '% {\n\t\t' + style +': ' + part.progression + '%;\n\t\tanimation-timing-function: cubic-bezier(' + part.function +');\n\t}\n';
        else
            string = '\t' + part.time + '% {\n\t\ttransform: ' + insertData(style, part.progression, '%') + ';\n\t\tanimation-timing-function: cubic-bezier(' + part.function +');\n\t}\n';
        animation += string;
    }
    if(!isDependentStyle(style))
        animation += '\t100% {\n\t\t' + style +': 100%;\n\t}';
    else
        animation += '\t100% {\n\t\ttransform: ' + insertData(style, '100', '%')+';\n\t}';
    return animation;
}

/*

    Code animation

 */

let animationArchive = [
    {name: 'slideInLeft', style: 'translate3d(%,0,0)', states: { p1: new Point(.42, 1), p2: new Point(.58, 0)}},
    {name: 'linear', style: 'left', states: { p1: new Point(.25, .75), p2: new Point(.75, .25)}},
    {name: 'easeIn', style: 'left', states: { p1: new Point(.42, 1), p2: new Point(1, 0)}},
    {name: 'easeOut', style: 'left', states: { p1: new Point(0, 1), p2: new Point(.58, 0)}},
    {name: 'easeInOut', style: 'left', states: { p1: new Point(.42, 1), p2: new Point(.58, 0)}},
    {name: 'easeOutIn', style: 'left', states: { p1: new Point(0, .42), p2: new Point(1, .58)}}
];

let generalAnimationStyle = 'left';

function insertData(string, data, metric) {
    let array = string.split('%');
    return array.join(data + metric);
}

function isDependentStyle(style){
    return style.split('%').length > 1;
}

let refreshCodeBtn = document.getElementById('refresh'),
    animationStyle = document.getElementById('select-style');
animationStyle.addEventListener('change', refreshCode );
refreshCodeBtn.addEventListener('click', refreshCode);
function refreshCode(){
    let style = animationStyle[animationStyle.selectedIndex].value,
        currentGraph = previewCurves[currentCurve].graph;
    generalAnimationStyle = style;

    let animation = computeAnimation(currentGraph, style);
    let animationString = '@keyframes animation-' + currentCurve +' {\n' + animation + '\n}' +
        '\n.time {\n\tanimation-duration: ' + DurationString + ';\n}';
        let code = document.getElementById('code-box');
        code.children[1].value = animationString;
        let len = animationString.split('\n').length;
        let numbers = '';
        for (let j = 1; j <= len; j++)
            numbers += j + '\n';
        code.children[0].innerHTML = numbers;
        code.children[1].columns = numbers;
}



/*

    Box animation ->

 */

let boxTimeouts = [];
function playAnimation(event) {
    setAnimation();
    this.style.backgroundColor = graphInterface.color0;
    this.getElementsByClassName('tool-text')[0].style.color = '#fff';
    this.getElementsByTagName('img')[0].style.fill = '#fff';
    this.removeEventListener('click', playAnimation);


    for(let i=0; i < previewCurves.length; i++) {
        if(previewCurves[i].active) {
            let row = document.getElementById('box-' + i),
                box = row.getElementsByClassName('box')[0];
            box.classList.remove("normal");
            box.offsetWidth = box.offsetWidth;
            box.classList.add("normal");
            boxTimeouts[i] = window.setTimeout(boxRefreshHide.bind(box), Duration + 750, i);
        }
    }
}

function boxRefreshHide(idx){
    clearTimeout(boxTimeouts[idx]);
    this.style.transform = 'scale(0, 0)';
    this.style.opacity = '0';
    window.setTimeout(boxRefreshShow.bind(this), 400);
}

function boxRefreshShow(){
    playAnimationBtn.style.removeProperty('background-color');
    playAnimationBtn.getElementsByClassName('tool-text')[0].style.removeProperty('color');
    playAnimationBtn.getElementsByTagName('img')[0].style.fill = 'var(--color-0)';
    playAnimationBtn.addEventListener('click', playAnimation);
    this.classList.remove("normal");
    this.style.left = '0px';
    this.style.removeProperty('transform');
    this.style.removeProperty('opacity');
    this.offsetWidth = this.offsetWidth;
}


/*

    Tabs and Buttons

*/

let tabs = document.getElementById('tabs');
let tabsContent = document.getElementById('tab-content');
for (let i = 0; i < tabs.children.length; i++) {
    let tab = tabs.children[i];
    tab.addEventListener('mouseenter', tabOpen);
    tab.addEventListener('click', changeContent);
}

let tabContentTimeout = {};
function tabOpen(event) {
    let nodes = Array.prototype.slice.call(tabs.children);
    let idx = nodes.indexOf(this);
    tabContentTimeout[idx] = window.setTimeout(checkHold.bind(this), 800, idx);
    this.addEventListener('mouseleave', tabClose);
}

function checkHold(idx) {
    delete tabContentTimeout[idx];
    let text = this.getElementsByClassName('tab-text')[0];
    text.style.width = '75px';
    this.style.width = '135px';
}

function tabClose(event) {
    let nodes = Array.prototype.slice.call(tabs.children);
    let idx = nodes.indexOf(this);
    clearTimeout(tabContentTimeout[idx]);
    let text = this.getElementsByClassName('tab-text')[0];
    text.style.width = '0';
    this.style.width = '100%';
}

function changeContent(event) {
    let nodes = Array.prototype.slice.call(tabs.children);
    let idx = nodes.indexOf(this);
    if(idx == 1){
        refreshCode();
    }
    //clearTimeout(tabContentTimeout[idx]);
    for (let i = 0; i < tabsContent.children.length; i++) {
        tabsContent.children[i].classList.remove('show');
    }
    let content = tabsContent.children[idx];
    content.classList.add('show');
    for (let i = 0; i < tabs.children.length; i++) {
        tabs.children[i].classList.remove('active');
    }
    this.classList.add('active');
}

let tools = document.getElementById('preview-tools').children;
for (let i = 0; i < tools.length; i++) {
    let tool = tools[i];
    tool.addEventListener('mouseenter', toolOpen);
}

let ctools = document.getElementById('code-tools').children;
for (let i = 0; i < ctools.length; i++) {
    let tool = ctools[i];
    tool.addEventListener('mouseenter', toolOpen);
}

let buttonsTimeout = {};
function toolOpen(event) {
    let nodes = Array.prototype.slice.call(tools);
    let idx = nodes.indexOf(this);
    buttonsTimeout[idx] = window.setTimeout(checkHoldTool.bind(this), 800, idx);
    this.addEventListener('mouseleave', toolClose);
}

function checkHoldTool(idx) {
    delete buttonsTimeout[idx];
    let text = this.getElementsByClassName('tool-text')[0];
    text.style.width = getLength(text.innerText) + 10 + 'px';
}

function toolClose(event) {
    let nodes = Array.prototype.slice.call(tools);
    let idx = nodes.indexOf(this);
    clearTimeout(buttonsTimeout[idx]);
    let text = this.getElementsByClassName('tool-text')[0];
    text.style.width = '0';
}

function getLength(text) {
    let c = document.createElement('canvas'),
        ctx = c.getContext("2d");
    ctx.font = "18px Nunito";
    return ctx.measureText(text).width;
}

let canvasTools = document.getElementById('canvas-tools').children;
for (let i = 0; i < canvasTools.length; i++) {
    let tool = canvasTools[i];
    tool.addEventListener('mouseenter', toolOpen);
}

/*

    Archive and server request

 */

let archiveCurves = [];

function APIGetJson(url, callback) {
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open('GET', url);
    request.onload = function () {
        callback(request.response);
    };
    request.send();
}

function APIPostJson(url, object, callback) {
    return APIRequest(url, 'POST', object, callback);
}

function APIPutJson(url, object, callback) {
    return APIRequest(url, 'PUT', object, callback);
}

function APIDeleteJson(url, object, callback) {
    return APIRequest(url, 'DELETE', object, callback);
}

function APIRequest(url, type, object, callback) {
    const params = JSON.stringify(object);
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open(type, url, true);
    request.setRequestHeader("Content-type", "application/json; charset=utf-8");
    request.onload = function () {
        callback(request.response);
    };
    request.send(params);
}

function getArchiveFromServer() {
    return new Promise(resolve => {
        APIGetJson('/api/archive', function (response) {
            resolve(response);
        });
    });
}

function postCurveToServer(curve) {
    let beziers = [];
    for(let i=0; i<curve.graph.bezierList.length; i++){
        let bezier = curve.graph.bezierList[i];
        beziers.push(bezier.points);
    }
    return new Promise(resolve => {
        let json = { name: curve.name, bezierList: beziers};
        APIPostJson('/api/archive', json,function (response) {
            resolve(response);
        });
    });
}

let saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', addCurveToArchive);
async function addCurveToArchive() {
    let curve = await postCurveToServer(previewCurves[currentCurve]);
    archiveCurves.push(curve);
}

function deleteCurveFromServer() {

}

let refreshArchiveBtn = document.getElementById('refresh-archive');
refreshArchiveBtn.addEventListener('click', refreshArchive);
function refreshArchive(){
    ArchiveBox.innerHTML = '';
    loadArchive();
}

let ArchiveBox = document.getElementById('archive-box');
async function loadArchive() {
    let curves = await getArchiveFromServer();
    archiveCurves = curves;
    for(let i=0; i<archiveCurves.length; i++){
        let curve = archiveCurves[i];
        curve.date = new Date(curve.date);
    }
    archiveCurves.sort((a, b) => {  return a.date>b.date ? -1 : a.date<b.date ? 1 : 0;});
    let date = new Date(archiveCurves[0].date.getFullYear(), archiveCurves[0].date.getMonth(), archiveCurves[0].date.getDate());
    ArchiveBox.append(createDateSeparator(date));
    for(let i=0; i<archiveCurves.length; i++){
        let curve = archiveCurves[i];
        let curdate = new Date(curve.date.getFullYear(), curve.date.getMonth(), curve.date.getDate());
        if(date.getTime() != curdate.getTime()){
            date = curdate;
            ArchiveBox.append(createDateSeparator(date));
        }
        ArchiveBox.append(createArchiveCurve(curve, i));
    }
}

function createDateSeparator(date) {
    let separator = document.createElement('div');
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if(date - today == 0) {
        separator.innerHTML = '--- Today ----------------------------------------------------------';
        return separator;
    }
    let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if(date - yesterday == 0) {
        separator.innerHTML = '--- Yesterday -----------------------------------------------------';
        return separator;
    }
    let week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    if(date > week){
        separator.innerHTML = '--- Last Week -----------------------------------------------------';
        return separator;
    }
    let month = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    if(date > month){
        separator.innerHTML = 'Last Month';
        return separator;
    }

    return separator;
}

function createArchiveCurve(info, idx) {
    let curve = document.createElement('div');
    curve.id = 'aCurve-' + idx;
    curve.classList.add('archive-row');


    curve.innerHTML =
        '<div class="track"><div class="trace"><div class="trace-block"></div><div class="trace-block"></div></div><div class="box-path"><div class="box time animation"></div></div></div>' +
        '<div class="box-name"> <div class="box-name-text">'+ info.name +'</div> <div class="tool"><div class="tool-icon"><img src="static/play.svg"></div></div>';

    //curve.innerHTML = '<div class="flex center"><div class="tool"><div class="tool-icon"><img src="static/play.svg"></div><div class="tool-text" style="width: 0">Play</div></div>' +
    //                    '<div>' + info.name + '</div></div>';

    return curve;
}

function deleteArchiveCurve() {

}

function playArchiveCurve() {

}

/*

        Selector with tail.selector

*/

document.addEventListener("DOMContentLoaded", function(){
    tail.select("select", { search: true });
});



/*

        Animation Sandbox

 */

let animationSandbox = document.getElementById('animationSandbox');
animationSandbox.addEventListener('click', playSandbox);
function playSandbox() {
    let style = animationStyle[animationStyle.selectedIndex].value,
        currentGraph = previewCurves[currentCurve].graph;

    let animation = computeAnimation(currentGraph, style);
    let animationString = '@keyframes animation-sandbox{\n' + animation + '\n}' +
        '\n.time {\n\tanimation-duration: ' + DurationString + ';\n}';

    animationSandboxHead.innerHTML = animationString;
    this.classList.remove("sandbox-normal");
    this.offsetWidth = this.offsetWidth;
    this.classList.add("sandbox-normal");
    window.setTimeout(removeAnimationSandbox.bind(this), Duration + 750);
}

function removeAnimationSandbox() {
    this.classList.remove("sandbox-normal");
}
