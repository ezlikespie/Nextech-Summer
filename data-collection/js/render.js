//-------------------------------------------------
// Written by Ethan Zentz - 6/16/2020
// Nextech Summer Coding Competition Submission
//-------------------------------------------------

var canvas, ctx, width, height;
const FPS = 30;
const CAMERA_VEL_MAX = 20;
const CAMERA_ACC = 2;
const CAMERA_DECEL = 0.9;
var cameraX = 0;
var cameraY = 0;
var cameraVelX = 0;
var cameraVelY = 0;
var doCameraFollow = false;
var cameraFollowNode = null;

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

function drawRectAdj(x,y,w,h,c){
	let adjustedX = x-cameraX;
	let adjustedY = y-cameraY;
	ctx.fillStyle = c;
	ctx.fillRect(adjustedX,adjustedY,w,h);
}

//render node with respect to camera position
function drawNode(node){
	let adjustedX = node.x-cameraX;
	let adjustedY = node.y-cameraY;
	ctx.fillStyle = node.outline;
	ctx.beginPath();
	ctx.arc(adjustedX,adjustedY,node.radius,0,2*Math.PI);
	ctx.fill();
	ctx.fillStyle = node.color;
	ctx.beginPath();
	ctx.arc(adjustedX,adjustedY,Math.round(node.radius/1.2),0,2*Math.PI);
	ctx.fill();
}

//test if node is in view
function inView(node){
	let adjustedX = node.x-cameraX;
	let adjustedY = node.y-cameraY;
	return !(adjustedX+node.radius<=0||adjustedX-node.radius>=width||adjustedY+node.radius<=0||adjustedY-node.radius>=height);
}

function rectInView(rect){
	let adjustedX = rect.x-cameraX;
	let adjustedY = rect.y-cameraY;
	return !(adjustedX+rect.w<=0||adjustedX>=width||adjustedY+rect.h<=0||adjustedY>=height);
}

function updateCameraPos(){
	if(doCameraFollow){
		let curNode = entities[cameraFollowNode];
		cameraX = curNode.x-width/2;
		cameraY = curNode.y-height/2;
		return;
	}
	cameraVelX *= CAMERA_DECEL;
	cameraVelY *= CAMERA_DECEL;
	cameraVelX += (keys[1])?CAMERA_ACC:0;
	cameraVelX += (keys[3])?-CAMERA_ACC:0;
	cameraVelY += (keys[0])?-CAMERA_ACC:0;
	cameraVelY += (keys[2])?CAMERA_ACC:0;
	if(cameraVelX>CAMERA_VEL_MAX)
		cameraVelX=CAMERA_VEL_MAX;
	else if(cameraVelX<-CAMERA_VEL_MAX)
		cameraVelX=-CAMERA_VEL_MAX;
	if(cameraVelY>CAMERA_VEL_MAX)
		cameraVelY=CAMERA_VEL_MAX;
	else if(cameraVelY<-CAMERA_VEL_MAX)
		cameraVelY=-CAMERA_VEL_MAX;
	cameraX+=cameraVelX;
	cameraY+=cameraVelY;
}

function startSimulation() {
	setup();
	setInterval(function(){
		//clear screen
		drawRect(0,0,width,height,"#b5c1ff");
		//iterate nodes
		for(const entityIndex in entities){
			const entity = entities[entityIndex];
			entity.render();
		}
		for(const personIndex in people){
			const person = people[personIndex];
			person.update();
		}
		updateCameraPos();
	}, 1000/FPS);
}

var keys = [false, false, false, false];
document.onkeydown = function(e){
	switch(e.keyCode){
		case 38:
			keys[0] = true;
			break;
		case 39:
			keys[1] = true;
			break;
		case 40:
			keys[2] = true;
			break;
		case 37:
			keys[3] = true;
	}
}
document.onkeyup = function(e){
	switch(e.keyCode){
		case 38:
			keys[0] = false;
			break;
		case 39:
			keys[1] = false;
			break;
		case 40:
			keys[2] = false;
			break;
		case 37:
			keys[3] = false;
	}
}

var nodeControl = {
	"displayed": false,
	"currentNode": null
}

document.onmousedown = function(e){
	let box = document.getElementById("node-controller-container");
	if(e.pageX<=box.clientWidth&&e.pageY>=(window.innerHeight-box.clientHeight))
		return;
	let adjX = e.pageX+cameraX;
	let adjY = e.pageY+cameraY;
	var selNode;
	for(let id in people){
		let person = people[id];
		if(Math.pow(adjX-person.x,2)+Math.pow(adjY-person.y,2)<=400){
			selNode = person;
			break;
		}
	}
	if(selNode==null){
		$("#node-controller-container").css("display","none");
		nodeControl.displayed = false;
		return;
	}
	nodeControl.displayed = true;
	nodeControl.currentNode = selNode;
	$("#node-controller-container").css("display","block");
	$("#node-controller-infect").prop("checked", selNode.infected);
	$("#node-controller-camera").prop("checked", selNode.id==cameraFollowNode&&doCameraFollow);
	$("#node-controller-id").text("id: "+selNode.id);
	$("#node-controller-predict-answer").css("display", "none");
}

$(document).ready(function(){
	$("#node-controller-infect").change(function(){
		if(nodeControl.displayed) {
			if(this.checked)
				nodeControl.currentNode.infect();
			else
				nodeControl.currentNode.cure();
		}
	});
	$("#node-controller-camera").change(function(){
		if(nodeControl.displayed) {
			if(this.checked) {
				cameraFollowNode = nodeControl.currentNode.id;
				doCameraFollow = true;
			}
			else {
				doCameraFollow = false;
			}
		}
	});
	$("#node-controller-predict-button").click(function(){
		if(nodeControl.displayed) {
			$("#node-controller-predict-answer").css("display", "block");
			$("#node-controller-predict-answer").text(((nodeControl.currentNode.infected)?"INFECTED":"NOT INFECTED"));
		}
	});
});

