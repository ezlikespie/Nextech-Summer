//-------------------------------------------------
// Written by Ethan Zentz - 6/16/2020
// Nextech Summer Coding Competition Submission
//-------------------------------------------------

var entities = {};
var people = {};
var locations = {};

const P_COLOR = "rgb(192,192,192)";
const P_OUTLINE = "rgb(130,130,130)";
const P_COLOR_INFECTED = "rgb(255,0,0)";
const P_OUTLINE_INFECTED = "rgb(180,0,0)";
const P_SPEED = 10;
const HOUSE_SIZE = 80;
const HOUSE_COLOR = "#e8e8e8";
const HOUSE_OUTLINE = "#828282";
const HOUSE_SPACING = 20;
const LOCATION_COLOR = "rgb(0,255,0)";
const LOCATION_OUTLINE = "rgb(0,180,0)";
const LOCATION_RADIUS = 30;
const RANDOM_THRESHOLD = 0.5;

//taken from w3resource.com
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

//==================== Setup ===================
function setup(){
	spawnNodes();
}

//==================== Spawn Nodes ===========================
function spawnNodes(){
	for(var n = 0; n<6; n++)
		for(var i = 0; i<6; i++)
			new LNode(width+200-LOCATION_RADIUS*2*(6-i)-400*(5-i), height-HOUSE_SIZE*(5-n)-HOUSE_SPACING*10*(4-n)-100);
	for(var n = 0; n<5; n++)
		for(var i = 0; i<20; i++) {
			var h = new House(width-HOUSE_SIZE*(20-i)-HOUSE_SPACING*(19-i), height-HOUSE_SIZE*(5-n)-HOUSE_SPACING*10*(4-n));
			new PNode(width-HOUSE_SIZE*(20-i)-HOUSE_SPACING*(19-i)+HOUSE_SIZE/2, height-HOUSE_SIZE*(5-n)-HOUSE_SPACING*10*(4-n)+HOUSE_SIZE/2, h.id);
		}
}

//==================== Node Superclass ========================
var Node = function(x,y,type=0){
	this.id = create_UUID();
	this.x = x;
	this.y = y;
	this.type = type;
	this.radius = 20;
	this.color = "black";
	this.outline = "black";
	entities[this.id] = this;
}

//==================== P-Node =========================
var PNode = function(x,y,hid){
	Node.call(this, x, y, 1);
	this.color = P_COLOR;
	this.outline = P_OUTLINE;
	this.houseId = hid;
	this.urge = 0;
	this.infected = false;
	this.stationary = true;
	this.waiting = false;
	this.destination;
	this.destinationWait = 0;
	this.destinationWaitLimit = Math.random()*90+30;
	this.urgeLimit = Math.random()*300+90;
	people[this.id] = this;
}

PNode.prototype.render = function(){
	drawNode(this);
}

PNode.prototype.update = function(){
	if(this.waiting) {
		this.destinationWait++;
		if(this.destinationWait>this.destinationWaitLimit){
			this.destinationWait = 0;
			this.destinationWaitLimit = Math.random()*90+30;
			this.waiting = false;
			this.destination.interact(this);
			this.travelTo(entities[this.houseId]);
		}
	}
	else if(this.stationary) {
		this.urge++;
		if(this.urge>=this.urgeLimit){
			this.urge = 0;
			this.travelTo(this.chooseLocation());
		}
	} else {
		let offX = ((this.destination.type==3)?(this.destination.x+this.destination.w/2):this.destination.x)-this.x;
		let offY = ((this.destination.type==3)?(this.destination.y+this.destination.h/2):this.destination.y)-this.y;
		let mod = ((this.destination.type==2)?(this.radius+this.destination.radius):0);
		let distDest = Math.sqrt(Math.pow(offX,2)+Math.pow(offY,2))-mod;
		if(distDest>P_SPEED){
			let ratio = P_SPEED/distDest;
			this.x+=offX*ratio;
			this.y+=offY*ratio;
		} else {
			let ratio = distDest/(distDest+mod);
			this.x+=offX*ratio;
			this.y+=offY*ratio;
			if(this.destination.type == 2)
				this.waiting = true;
			else if(this.destination.type == 3){
				this.stationary = true;
				this.setUrgeLimit();
			}
		}
	}
}

PNode.prototype.setUrgeLimit = function(){
	this.urgeLimit = (Math.random()*300+90)*(this.infected?3:1);
}

function computeDistance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

PNode.prototype.chooseLocation = function(){
	var selDist = [];
	var selLoc = [];
	var keepDist = [];
	var keepLoc = [];
	var minLoc;
	var minDist;
	for(var id in locations){
		selLoc[selLoc.length] = locations[id];
		selDist[selDist.length] = computeDistance(this.x,this.y,locations[id].x,locations[id].y);
		if(minLoc==null){
			minLoc=selLoc[selLoc.length-1];
			minDist=selDist[selDist.length-1];
		} else if(selDist[selDist.length-1]<minDist){
			minLoc=selLoc[selLoc.length-1];
			minDist=selDist[selDist.length-1];
		}
	}
	for(var i in selDist){
		if(selDist[i]<=minDist*3){
			keepDist[keepDist.length]=selDist[i];
			keepLoc[keepLoc.length]=selLoc[i];
		}
	}
	for(var i in keepDist){
		if(Math.random()*keepDist[i]/minDist<RANDOM_THRESHOLD)
			return keepLoc[i];
	}
	return minLoc;
}

PNode.prototype.travelTo = function(loc){
	this.stationary = false;
	this.destination = loc;
}

PNode.prototype.infect = function(){
	this.infected = true;
	this.color = P_COLOR_INFECTED;
	this.outline = P_OUTLINE_INFECTED;
}

PNode.prototype.cure = function(){
	this.infected = false;
	this.color = P_COLOR;
	this.outline = P_OUTLINE;
}

//==================== Node House =========================
var House = function(x,y,w=HOUSE_SIZE,h=HOUSE_SIZE){
	this.id = create_UUID();
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.type = 3;
	this.color = HOUSE_COLOR;
	this.outline = HOUSE_OUTLINE;
	entities[this.id] = this;
}

House.prototype.render = function(){
	drawRectAdj(this.x, this.y, this.w, this.h, this.outline);
	drawRectAdj(this.x+2, this.y+2, this.w-4, this.h-4, this.color);
}

//==================== Location =========================
var LNode = function(x,y){
	Node.call(this,x,y,2);
	this.color = LOCATION_COLOR;
	this.outline = LOCATION_OUTLINE;
	this.radius = LOCATION_RADIUS;
	this.infectionStatus = 0;
	locations[this.id] = this;
}

LNode.prototype.render = function(){
	drawNode(this);
}

LNode.prototype.interact = function(person){
	if(person.infected){
		this.infectionStatus+=20;
		if(this.infectionStatus>100)
			this.infectionStatus=100;
		this.updateColor();
	} else {
		if(Math.random()<(this.infectionStatus/100))
			person.infect();
	}
}

LNode.prototype.updateColor = function(){
	let colorVal = Math.round(this.infectionStatus * 510/100);
	let outlineVal = Math.round(this.infectionStatus * 360/100);
	let colorVal1 = (colorVal<255)?colorVal:255;
	let colorVal2 = (colorVal<255)?255:(510-colorVal);
	let outlineVal1 = (outlineVal<180)?outlineVal:180;
	let outlineVal2 = (outlineVal<180)?180:(360-outlineVal);
	this.color = "rgb("+colorVal1+","+colorVal2+",0)";
	this.outline = "rgb("+outlineVal1+","+outlineVal2+",0)";
}
