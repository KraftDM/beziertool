function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype = {
    isHover: function (point) {
        if (point.trigger) {
            return Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2) <= point.trigger * point.trigger;
        } else
            return (point.x == this.x && point.y == this.y);
    },
};

// specializes only  for cubic bezier curve
function Bezier(p0, p1, p2, p3) {
    /*
        p0 - start state point,
        p1 - start control point,
        p2 - end control point,
        p3 - end state point;
    */
    this.points = [p0, p1, p2, p3];
    this.LUT = [];
    this.dpoints = this.derive(this.points);
    this.updateLUT();
}

Bezier.prototype = {
    split: function (point, h) {
        let p0 = this.points[0], p1 = this.points[1], p2 = this.points[2], p3 = this.points[3];

        function findPartLine(p1, p2) {
            let x = (1 - h) * p1.x + h * p2.x,
                y = (1 - h) * p1.y + h * p2.y;
            return new Point(x, y);
        }

        let q0 = findPartLine(p0, p1), q1 = findPartLine(p1, p2), q2 = findPartLine(p2, p3);
        let m1 = findPartLine(q0, q1), m2 = findPartLine(q1, q2);

        let bezier1 = new Bezier(p0, q0, m1, point),
            bezier2 = new Bezier(point, m2, q2, p3);
        return [bezier1, bezier2];
    },
    updateLUT: function () {
        this.LUT = this.getLUT();
    },
    normalize: function () {
        let py0 = this.points[0].y,
            py1 = this.points[1].y,
            py2 = this.points[2].y,
            py3 = this.points[3].y,
            minY = Math.min(py0, py3),
            n = 1 / (Math.abs(py0 - py3));
        py1 = 1 - ((py1 - minY) * n).toFixed(2);
        py2 = 1 - ((py2 - minY) * n).toFixed(2);
        if (py0 >= py3) {
            return this.points[1].x.toFixed(2) + ','+ py1.toFixed(2) + ','+ this.points[2].x.toFixed(2) +','+ py2.toFixed(2);
        } else {
            return this.points[1].x.toFixed(2) + ','+ (1 - py1).toFixed(2) + ','+ this.points[2].x.toFixed(2) +','+ (1 - py2).toFixed(2);
        }
    },
    getPartsOfAnimation: function () {
        let sps = this.points[0],
            spe = this.points[3],
            cps = this.points[1],
            cpe = this.points[2],
            top = Math.min(sps, spe),
            bottom = Math.max(sps, spe);

        let alpha = 0.05;
        let extremes = this.extrema();
        if (extremes.length == 0) {
            let bezier = this.normalize();
            let parts = [],
                part = { time: Math.round(sps.x * 100), progression: Math.round((1 - sps.y)*100), function: bezier };
            parts.push(part);
            return parts;
        }

        if(extremes.length == 1){
            let t = extremes[0],
                p = this.compute(t),
                beziers = this.split(p, t),
                parts = [];
            let bezier1 = beziers[0].normalize();
            let part1 = { time: Math.round(beziers[0].points[0].x * 100), progression: Math.round((1 - beziers[0].points[0].y)*100), function: bezier1 };
            parts.push(part1);
            let bezier2 = beziers[1].normalize();
            let part2 = { time: Math.round(beziers[1].points[0].x * 100), progression: Math.round((1 - beziers[1].points[0].y)*100), function: bezier2 };
            parts.push(part2);
            return parts;
        }
        if(extremes.length == 2){
            console.log('2');
            let string = '';

            return string;
        }
            /*if ((p.y - bottom > alpha && bottom < p.y) || (top - p.y > alpha && top > p.y)) {
                let newbz = this.split(p, t);


            }*/

    },

    extrema: function () {

        function getY(p) {
            return p.y;
        }

        function numberSort(a, b) {
            return a - b;
        }

        let result = {},
            //roots = [],
            p;

        p = this.dpoints[0].map(getY);
        result = this.droots(p);
        if (this.order === 3) {
            p = this.dpoints[1].map(getY);
            result = result.concat(this.droots(p));
        }
        result = result.filter(function (t) {
            return t >= 0 && t <= 1;
        });

        //roots = roots.concat(result[y].sort(numberSort));

        //roots = roots.sort(numberSort).filter(function (v, idx) {
        //   return roots.indexOf(v) === idx;
        //});

        //result.values = roots;
        return result;
    },
    derive: function (points) {
        let dpoints = [];
        for (let p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
            let list = [];
            for (let j = 0, dpt; j < c; j++) {
                dpt = {
                    x: c * (p[j + 1].x - p[j].x),
                    y: c * (p[j + 1].y - p[j].y)
                };
                list.push(dpt);
            }
            dpoints.push(list);
            p = list;
        }
        return dpoints;
    },
    droots: function (p) {
        if (p.length === 3) {
            let a = p[0],
                b = p[1],
                c = p[2],
                d = a - 2 * b + c;
            if (d !== 0) {
                let m1 = -Math.sqrt(b * b - a * c),
                    m2 = -a + b,
                    v1 = -(m1 + m2) / d,
                    v2 = -(-m1 + m2) / d;
                return [v1, v2];
            } else if (b !== c && d === 0) {
                return [(2 * b - c) / (2 * (b - c))];
            }
            return [];
        }
    },
    projection: function (point) {
        //this.updateLUT(); //??? delete
        let closest = this.closest(point),
            minDist = closest.minDist,
            minLutIdx = closest.minLutIdx;

        let minT = 1,
            steps = this.LUT.steps,
            start = (minLutIdx - 1) / steps,
            end = (minLutIdx + 1) / steps,
            step = 0.1 / steps;
        for (let t = start + step; t < end; t += step) {
            let p = this.compute(t),
                d = this.dist(point, p);
            if (d < minDist) {
                minDist = d;
                minT = t;
            }
        }
        minT = minT < 0 ? 0 : minT;
        minT = minT > 1 ? 1 : minT;
        let optimalPoint = this.compute(minT);
        optimalPoint.t = minT;
        optimalPoint.d = minDist;
        return optimalPoint;
    }
    ,
    closest: function (point) {
        let minDist = 1, minLutIdx = 0, bezier = this;
        this.LUT.forEach((p, idx) => {
            let dist = bezier.dist(point, p);
            if (dist < minDist) {
                minDist = dist;
                minLutIdx = idx;
            }
        });
        return {minDist: minDist, minLutIdx: minLutIdx};
    }
    ,
    dist: function (p1, p2) {
        let dx = p1.x - p2.x,
            dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    ,
    getLUT: function (steps) {
        if (this.points == this.LUT.points)
            return this.LUT;
        this.dpoints = this.derive(this.points);

        steps = steps || 100; // ??? optimize
        steps--;
        let LUT = [];
        for (let i = 0; i <= steps; i++) {
            let t = i / steps; // t ∈ [0, 1]
            LUT.push(this.compute(t));
        }
        LUT.points = this.points.slice(0);
        LUT.steps = steps;
        return LUT;
    }
    ,
    compute: function (t) {
        let p = this.points;
        if (t === 0) {
            return p[0];
        }
        if (t === 1) {
            return p[p.length - 1];
        }

        let mt = 1 - t,
            mt2 = mt * mt,
            t2 = t * t,
            a = mt2 * mt,
            b = mt2 * t * 3,
            c = mt * t2 * 3,
            d = t2 * t;

        let x = a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
            y = a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y;
        return new Point(x, y);
    }
};

function Graph() {
    this.bezierList = [new Bezier(
        new Point(0, 1),
        new Point(0.25, 0.75),
        new Point(0.75, 0.25),
        new Point(1, 0)
    )];

    this.left = 0;
    this.top = 0;
    this.bottom = 0;
    this.right = 0;
    this.setBlocks = function (offsetX, offsetY) {
        this.left = 0; //- offsetX;
        this.right = 1;//+ offsetX;
        this.top = 0 - offsetY;
        this.bottom = 1 + offsetY;
    };

    this.currentControlPoint = null;
    this.currentBezierCurve = null;
    this.currentStatePoint = null;
    this.currentPointOnCurve = null;
}

Graph.prototype = {
    getValue: function (nx) {
        let list = this.bezierList;
        for (let j = 0; j < list.length; j++) {
            let lut = list[j].LUT;
            for (let i = 0; i < lut.length; i++) {
                let x = lut[i].x;//.toFixed(3);
                if (x - 0.01 < nx && nx < x + 0.01) {
                    return lut[i].y;
                }
            }
        }
    },
    getPartsOfAnimation: function(){
        let list = this.bezierList;
        let parts = [];
        for (let i = 0; i < list.length; i++) {
            let bezier = list[i];
            parts = parts.concat( bezier.getPartsOfAnimation() );
        }
        return parts;
    },
    splitBezier: function () {
        if (!this.currentPointOnCurve)
            return;
        let newbz = this.currentPointOnCurve.bezier.split(this.currentPointOnCurve, this.currentPointOnCurve.t);
        let idx = this.bezierList.indexOf(this.currentPointOnCurve.bezier);
        this.bezierList.splice(idx, 1, newbz[0], newbz[1]);
    },
    updateBezier: function () {
        this.bezierList.forEach(bezier => bezier.updateLUT());
    },
    getExtremeStatePoints: function () {
        return [this.bezierList[0].points[0],
            this.bezierList[this.bezierList.length - 1].points[3]
        ];
    },
    getControlOverPoint: function (point) {
        let bezierList = this.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let startControlPoint = bezierList[i].points[1];
            if (startControlPoint.isHover(point)) {
                return {bezier: bezierList[i], point: startControlPoint};
            }
            let endControlPoint = bezierList[i].points[2];
            if (endControlPoint.isHover(point)) {
                return {bezier: bezierList[i], point: endControlPoint};
            }
        }
        return null;
    },
    moveControlPoint: function (point) {
        let x = point.x, y = point.y, radius = point.radius;

        let rightBlock = this.currentBezierCurve.points[3],
            leftBlock = this.currentBezierCurve.points[0];

        x = x > rightBlock.x ? rightBlock.x : x;
        x = x < leftBlock.x ? leftBlock.x : x;
        y = y + radius > this.bottom ? this.bottom - radius : y;
        y = y - radius < this.top ? this.top + radius : y;

        this.currentControlPoint.x = x;
        this.currentControlPoint.y = y;
    },
    getStateOverPoint: function (point) {
        let bezierList = this.bezierList;
        for (let i = 0; i < bezierList.length; i++) {
            let startStatePoint = bezierList[i].points[0];
            if (startStatePoint.isHover(point)) {
                return {bezier: bezierList[i], point: startStatePoint};
            }
            let endStatePoint = bezierList[i].points[3];
            if (endStatePoint.isHover(point)) {
                return {bezier: bezierList[i], point: endStatePoint};
            }
        }
        return null;
    },
    moveStatePoint: function (point) {
        let x = point.x, y = point.y, radius = point.radius;

        x = x > this.right ? this.right : x;
        x = x < this.left ? this.left : x;
        y = y + radius > this.bottom ? this.bottom - radius : y;
        y = y - radius < this.top ? this.top + radius : y;

        let dx = x - this.currentStatePoint.x,
            dy = y - this.currentStatePoint.y;

        this.currentBezierCurve.points[2].x += dx;
        this.currentBezierCurve.points[2].y += dy;
        let idx = this.bezierList.indexOf(this.currentBezierCurve);
        let bezier = this.bezierList[idx + 1];
        bezier.points[1].x += dx;
        bezier.points[1].y += dy;

        this.currentStatePoint.x = x;
        this.currentStatePoint.y = y;
    },
    getClosestPointToCurve: function (point) {
        let optimalPoint = {d: 1};
        graph.bezierList.forEach(function (bezier, idx) {
            let p = bezier.projection(point);
            if (p.d < optimalPoint.d) {
                optimalPoint = p;
                optimalPoint.bezier = bezier;
            }
        });
        return optimalPoint.d != 1 ? optimalPoint : null;
    },
};