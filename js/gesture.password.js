;
(function(global, struct) {
    var defaults = {
        circle:{
            sizeScale:1,
            lineWidth:3,
            default:{
                strokeStyle:'#50A2E9'
            },
            wrong:{
                strokeStyle:'#D90106'
            },
            right:{
                strokeStyle:'#21864C'
            }
        },
        line:{
            lineWidth:3,
            default:{
                strokeStyle:'#50A2E9'
            },
            wrong:{
                strokeStyle:'#D90106'
            },
            right:{
                strokeStyle:'#21864C'
            }
        },
        dot:{
           size:8,
            default:{
                fillStyle:'#50A2E9'
            },
            wrong:{
                fillStyle:'#D90106'
            },
            right:{
                fillStyle:'#21864C'
            }
        }
 };
    function extendDeep() {
        var target = arguments[0];
        var len = arguments.length;
        for(var i = 1;i<len;i++){
            var source = arguments[i];
            for(var key in source){
                if(source.hasOwnProperty(key) && source[key] !== undefined){
                    if(typeof source[key] === 'object'){//
                        if(target[key] === undefined) target[key] = {};
                        extendDeep(target[key],source[key]);
                    }else{
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    }

    function getOffsetRect(elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElemt = document.documentElement;
        var scTop = window.pageYOffset || docElemt.scrollTop || body.scrollTop;
        var scLeft = window.pageXOffset || docElemt.scrollLeft || body.scrollLeft;

        //clientTop
        var cTop = docElemt.clientTop || body.clientTop || 0;
        var cLeft = docElemt.clientLeft || body.clientLeft || 0;

        var top = box.top + scTop + cTop;
        var left = box.left + scLeft + cLeft;
        return {
            top: top,
            left: left
        };
    }



    function getStyle(elem, prop) {
        var style = global.getComputedStyle && global.getComputedStyle(elem, null) || elem.currentStyle || elem.style;
        return style[prop];
    }

    function Point(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    struct.prototype = {
        constructor: struct,
        init: function(config) {
            this.size = this.container.offsetWidth - parseInt(getStyle(this.container, 'paddingLeft')) - parseInt(getStyle(this.container, 'paddingRight'))  -  parseInt(getStyle(this.container, 'borderLeftWidth')) - parseFloat(getStyle(this.container, 'borderRightWidth'));
            this.isDown = false;
            this.touchId = false;
            this.disable = false;
            this.hasMoved = false;
            this.state = 'default';
            this.config = extendDeep({},defaults,config);
            this.events = {};
            this.cList = [];
            this.sList = [];
            this.isRedraw = false;
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size;
            this.canvas.height = this.size;
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.cr = (this.size / 8 - this.config.circle.lineWidth)*this.config.circle.sizeScale;
            this.cm = this.size - (this.cr + this.config.circle.lineWidth)*6;
            this.drawCircle();

            //touch事件
            this.canvas.addEventListener('touchstart', this.handleDown.bind(this));
            this.canvas.addEventListener('touchmove', this.handleMove.bind(this));
            this.canvas.addEventListener('touchend', this.handleUp.bind(this));

            this.canvas.addEventListener('mousedown', this.handleDown.bind(this));
            this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
            this.canvas.addEventListener('mouseup', this.handleUp.bind(this));


        },
        drawCircle: function() {
            this.ctx.strokeStyle = this.config.circle.default.strokeStyle;
            this.ctx.lineWidth = this.config.circle.lineWidth;
            this.cList = [];
            var count = [0, 1, 2];
            this.ctx.beginPath();
            count.forEach(function(row) {
                count.forEach(function(column) {
                    var x = (this.cr + this.config.circle.lineWidth + this.cm / 6) * (2 * column + 1);
                    var y = (this.cr + this.config.circle.lineWidth) * (2 * row + 1) + 2 * row * this.cm / 6;
                    this.cList.push(new Point(x, y, 3 * row + column + 1));
                    this.ctx.moveTo(x + this.cr, y);
                    this.ctx.arc(x, y, this.cr, 0, 2 * Math.PI);
                }.bind(this));
            }.bind(this));

            this.ctx.stroke();
            this.backImg = this.ctx.getImageData(0, 0, this.size, this.size);

        },
        fixEvent: function(e) {
            var evt = e.changedTouches ? e.changedTouches[0] : e;
            evt.elementX = evt.pageX - getOffsetRect(this.canvas).left;
            evt.elementY = evt.pageY - getOffsetRect(this.canvas).top;
            evt.identifier = 'identifier' in evt ? evt.identifier : 0;
            return evt;
        },
        draw: function(evt) {
            this.checkIn(evt);
            this.ctx.clearRect(0, 0, this.size, this.size);
            this.ctx.putImageData(this.backImg, 0, 0);

            if (this.isRedraw) {
                this.drawPointAndLine();
                this.isRedraw = false;
            }
            var lastPoint = this.sList[this.sList.length - 1];
            if(lastPoint){
                this.ctx.strokeStyle = this.config.line[this.state].strokeStyle;
                this.ctx.beginPath();
                this.ctx.moveTo(lastPoint.x, lastPoint.y);
                this.ctx.lineTo(evt.elementX, evt.elementY);
                this.ctx.stroke();
            }

        },
        drawPointAndLine: function() {


            for (var i = 0; i < this.sList.length; i++) {
                var point = this.sList[i];
                this.ctx.beginPath();
                this.ctx.moveTo(point.x + this.cr, point.y);

                this.ctx.lineWidth = this.config.circle.lineWidth;
                this.ctx.fillStyle = this.config.dot[this.state].fillStyle;
                this.ctx.strokeStyle = this.config.circle[this.state].strokeStyle;

                this.ctx.arc(point.x, point.y, this.cr, 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, this.config.dot.size, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
                if (this.sList.length >= 2 && i >= 1) {
                    this.ctx.strokeStyle = this.config.line[this.state].strokeStyle;
                    this.ctx.lineWidth = this.config.line[this.state].lineWidth;
                    var prePoint = this.sList[i - 1];
                    this.ctx.beginPath();
                    this.ctx.moveTo(prePoint.x, prePoint.y);
                    this.ctx.lineTo(point.x, point.y);
                    this.ctx.closePath();
                    this.ctx.stroke();
                }
            }

            this.backImg = this.ctx.getImageData(0, 0, this.size, this.size);

        },
        handleDown: function(e) {
            e.preventDefault();
            if(!this.disable){
                var evt = this.fixEvent(e);
                if (!this.isDown) {
                    this.touchId = evt.identifier;
                    this.isDown = true;
                }
            }
        },
        handleUp: function(e) {
            e.preventDefault();
            if(!this.disable){
                var evt = this.fixEvent(e);
                if (evt.identifier === this.touchId) {
                    this.isDown = false;
                    this.ctx.clearRect(0, 0, this.size, this.size);
                    this.ctx.putImageData(this.backImg, 0, 0);
                    if(this.hasMoved){
                        this.disable = true;
                        this.emit('complete',this.getPassword());
                    }
                }
            }
        },
        handleMove: function(e) {
            e.preventDefault();
            if(!this.disable){
                var evt = this.fixEvent(e);
                if (this.isDown && evt.identifier === this.touchId) {
                    this.hasMoved = true;
                    this.draw(evt);
                }
            }
        },
        checkIn: function(evt) {
            for (var i in this.cList) {
                var x = this.cList[i].x;
                var y = this.cList[i].y;
                var pointDistance = Math.sqrt(Math.pow(x - evt.elementX, 2) + Math.pow(y - evt.elementY, 2), 2);
                if (pointDistance <= this.cr) {
                    this.isRedraw = true;
                    this.sList.push(this.cList.splice(i, 1)[0]);
                    break;
                }
            }
        },
        getPassword: function() {
            return this.sList.map(function(point) {
                return point.value;
            }).join('');
        },
        on: function(name, fn) {
            (this.events[name] || (this.events[name] = [])).push(fn);
        },
        off: function(name, fn) {
            if (this.events[name] === undefined || this.events[name].length === 0) {
                return false;
            } else {
                this.events[name].splice(this.events[name].indexOf(fn), 1);
            }
            return this.events[name].length;
        },
        emit: function(name) {
            if(this.events[name] === undefined){
                return false;
            }
            var args = arguments;
            this.events[name].forEach(function(fn){
                fn.apply(this,[].slice.call(args,1));
            }.bind(this));
        },
        setRight:function(){
            this.state = 'right';
            this.ctx.clearRect(0,0,this.size,this.size);
            this.drawCircle();
            this.drawPointAndLine();
        },
        setWrong:function(){
            this.state = 'wrong';
            this.ctx.clearRect(0,0,this.size,this.size);
            this.drawCircle();
            this.drawPointAndLine();
        },
        reset:function(){
            this.state = 'default';
            this.disable = false;
            this.sList = [];
            this.ctx.clearRect(0,0,this.size,this.size);
            this.drawCircle();

        }
    }

    //module
    if (typeof define === 'function' && define.amd) {
        define(struct);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = struct;
    } else {
        global.GesturePassword = struct;
    }
})(this, function(wrap, config) {
    if (!(this instanceof arguments.callee)) {
        return new arguments.callee.call(wrap, config);
    }

    this.container = typeof wrap === 'string' ? document.getElementById(wrap) : wrap;
    this.init(config);

})
