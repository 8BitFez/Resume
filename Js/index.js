var HORIZON_Y = 0.8;
var SPACING_Y = 2.4;
var SPACING_X = 40;
var SPACING_SCANLINES = 12;
var SKEW = 7;
var SPEED = 0.014;
var P_GLITCH = 0.005;
var GLITCH_PAUSE_DURATION = [1000, 1200]; // min, max in ms.
var COLOR = [255, 55, 255];
var TITLE = 'CYBER PILOT';
var rombas = [];
var rombas_out = 0;
//what your looking at me too?
var dynamicCtx = document.createElement('canvas').getContext('2d');
var staticCtx = document.createElement('canvas').getContext('2d');
var screenCtx = document.createElement('canvas').getContext('2d');
var ctxs = [dynamicCtx, staticCtx, screenCtx];

// Define and hydrate the state.
// The rest is filled onResize.
var state = {
	glitched: false,
	yOffset: 0 };


function onResize() {
	var h = state.h = window.innerHeight * 2;
	var w = state.w = window.innerWidth * 2;
	var y0 = state.y0 = h * (1 - HORIZON_Y);
	state.nHorizontal =
	Math.pow(h * HORIZON_Y, 1 / SPACING_Y);
	state.nVertical = Math.ceil(w / SPACING_X);
	state.nScanlines = Math.ceil(h / SPACING_SCANLINES);

	// Update the DOM.
	ctxs.forEach(function (ctx) {
		ctx.canvas.height = state.h;
		ctx.canvas.width = state.w;
	});

	drawStatic();
};

function drawStatic() {var
	h = state.h,w = state.w,y0 = state.y0,nVertical = state.nVertical;
	var ctx = staticCtx;

	ctx.clearRect(0, 0, w, h);



	drawScreenArtifacts();
}

function drawScreenArtifacts() {var
	h = state.h,w = state.w;
	var ctx = screenCtx;

	ctx.clearRect(0, 0, w, h);

	// Draw scanlines.
	var strokeOptions = {
		c1: 'rgba(44, 74, 44, 0.16)',
		c2: 'rgba(10, 0, 10, 0.16)' };

	for (var n = 0; n < state.nScanlines; ++n) {
		var y = n * SPACING_SCANLINES;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		stroke(ctx, strokeOptions);
	}

	// Draw glow.
	ctx.beginPath();
	var glow = ctx.createRadialGradient(
	w / 2, h / 2, Math.max(w, h),
	w / 2, h / 2, SPACING_X * 1.5);

	glow.addColorStop(0.2, 'rgba(0, 0, 0, 0.16)');
	glow.addColorStop(1.0, 'rgba(' + COLOR + ', 0.16)');
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, w, h);
}
function placeRombas() {

    //console.log("place rombas")
    var ctx = staticCtx;
	var h = Math.floor(Math.random() * 500),
		w = Math.floor(Math.random() * 600),
        x = h - (h*2),
        y = Math.random() * state.h,
        p = Math.random() * 40;
	var rect = ({x: x,y: y,w: w,h: h,speed:p});
    rombas.push(rect);
}

function drawDynamic() {var
	h = state.h,w = state.w,y0 = state.y0,nHorizontal = state.nHorizontal,yOffset = state.yOffset;
	var ctx = dynamicCtx;

	ctx.clearRect(0, 0, w, h);
	if (Math.random()< 0.06){
		placeRombas();
	};
	// Draw horizontal lines.
	for (var n = 0; n < rombas.length; n++){
		var rect = rombas[n]
		ctx.fillStyle = ('rgba(200,0,200,1)');
		ctx.fillRect(rect.x - 5 ,rect.y - 5,rect.h + 10 ,rect.w + 10);
		ctx.fillStyle = ('rgba(100,0,100,1)');
		ctx.fillRect(rect.x ,rect.y ,rect.h ,rect.w);
		rect.x = rect.x + rect.speed;
		if(rect.x > w){
				rombas.splice(n,1);
		}
};

	state.yOffset = (yOffset + SPEED) % 1;
}

function drawLoop() {
	requestAnimationFrame(drawLoop);

	if (state.glitched) return;
	drawDynamic();

	if (Math.random() > P_GLITCH) return;
	drawGlitch();
}

function drawGlitch() {var
	w = state.w,h = state.h;

	dynamicCtx.drawImage(staticCtx.canvas, 0, 0);
	staticCtx.clearRect(0, 0, w, h);

	var fullImageData = dynamicCtx.getImageData(0, 0, w, h);
	var glitchOptions = {
		quality: 4,
		amount: 0,
		iterations: 2 };

	glitch(glitchOptions).
	fromImageData(fullImageData).
	toImageData().
	then(function (imageData) {
		dynamicCtx.clearRect(0, 0, w, h);
		dynamicCtx.putImageData(imageData, 0, 0);
	});


	state.glitched = true;var

	minDelay = GLITCH_PAUSE_DURATION[0],maxDelay = GLITCH_PAUSE_DURATION[1];
	var delay = minDelay + Math.random() * (maxDelay - minDelay);
	setTimeout(function (_) {
		drawStatic();
		state.glitched = false;
	}, delay);
}

window.addEventListener('resize', throttle(onResize));

// Kick it off!
WebFont.load({
	active: function active() {
		onResize();
		drawLoop();
		ctxs.forEach(function (_ref) {var canvas = _ref.canvas;
			document.body.appendChild(canvas);
		});
	},
	classes: false,
	google: {
		families: ['Monoton'] } });



// A thin white line gives us a nice glow-y effect.
function stroke(ctx)




{var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},_ref2$w = _ref2.w1,w1 = _ref2$w === undefined ? 10 : _ref2$w,_ref2$w2 = _ref2.w2,w2 = _ref2$w2 === undefined ? 2 : _ref2$w2,_ref2$c = _ref2.c1,c1 = _ref2$c === undefined ? 'rgba(' + COLOR + ', 0.5)' : _ref2$c,_ref2$c2 = _ref2.c2,c2 = _ref2$c2 === undefined ? 'rgb(' + COLOR + ')' : _ref2$c2;
	ctx.lineWidth = w1;
	ctx.strokeStyle = c1;
	ctx.stroke();
	ctx.lineWidth = w2;
	ctx.strokeStyle = c2;
	ctx.stroke();
}

// Throttles a function to RAF.
function throttle(cb) {
	var queued = false;

	return function () {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
		if (queued) return;

		queued = true;
		requestAnimationFrame(function (_) {
			queued = false;
			cb.apply(undefined, args);
		});
	};
}
