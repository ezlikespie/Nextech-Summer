//-----------------------------------------------------------------
//				  Written by Ethan Zentz - 6/16/2020
//			  Nextech Summer Coding Competition Submission
//-----------------------------------------------------------------

var canvas, ctx, width, height;
const FPS = 30;
var cameraX = 0;
var cameraY = 0;

window.onload = function(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	startSimulation();
}

window.onresize = function(){
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
}

function drawRect(x,y,w,h,c){
	ctx.fillStyle = c;
	ctx.fillRect(x,y,w,h);
}

//render node with respect to camera position
function drawNode(node){
	let adjustedX = node.x-cameraX;
	let adjustedY = node.y-cameraY;
	ctx.fillStyle = node.outline;
	ctx.beginPath();
	ctx.arc(adjustedX,adjustedY,Math.round(node.radius*1.2),0,2*Math.PI);
	ctx.fill();
	ctx.fillStyle = node.color;
	ctx.beginPath();
	ctx.arc(adjustedX,adjustedY,node.radius,0,2*Math.PI);
	ctx.fill();
}

//test if node is in view
function inView(node){
	let adjustedX = node.x-cameraX;
	let adjustedY = node.y-cameraY;
	return !(adjustedX+node.radius<=0||adjustedX-node.radius>=width||adjustedY+node.radius<=0||adjustedY-node.radius>=height);
}

function startSimulation() {
	spawnNodes();
	setInterval(function(){
		//clear screen
		drawRect(0,0,width,height,"white");
		//iterate nodes
		for(const entityIndex in entities){
			const entity = entities[entityIndex];
			if(inView(entity))
				drawNode(entity);
		}
	}, 1000/FPS);
}