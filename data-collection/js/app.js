//-------------------------------------------------
// Written by Ethan Zentz - 6/16/2020
// Nextech Summer Coding Competition Submission
//-------------------------------------------------

var entities = {};
var people = {};
var locations = {};

const P_COLOR = "rgba(192,192,192)";
const P_OUTLINE = "rgba(130,130,130)";
const HOUSE_SIZE = 80;
const HOUSE_COLOR = "#e8e8e8";
const HOUSE_OUTLINE = "#828282";
const HOUSE_SPACING = 20;
const LOCATION_COLOR = "rgba(0,255,0)";
const LOCATION_OUTLINE = "rgba(0,115,0)";
const LOCATION_RADIUS = 30;

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
	for(var n = 0; n<5; n++)
		for(var i = 0; i<20; i++) {
			var h = new House(width-HOUSE_SIZE*(20-i)-HOUSE_SPACING*(19-i), height-HOUSE_SIZE*(5-n)-HOUSE_SPACING*10*(4-n));
			new PNode(width-HOUSE_SIZE*(20-i)-HOUSE_SPACING*(19-i)+HOUSE_SIZE/2, height-HOUSE_SIZE*(5-n)-HOUSE_SPACING*10*(4-n)+HOUSE_SIZE/2, h.id);
		}
	for(var n = 0; n<6; n++)
		for(var i = 0; i<6; i++)
			new LNode(width+200-LOCATION_RADIUS*2*(6-i)-400*(5-i), height-HOUSE_SIZE*(5-n)-HOUSE_SPACING*10*(4-n)-100);
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
	this.urgeLimit = Math.random()*300+90;
	people[this.id] = this;
}

PNode.prototype.render = function(){
	drawNode(this);
}

PNode.prototype.update = function(){
	
}

//==================== Node House =========================
var House = function(x,y,w=HOUSE_SIZE,h=HOUSE_SIZE){
	this.id = create_UUID();
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = HOUSE_COLOR;
	this.outline = HOUSE_OUTLINE;
	entities[this.id] = this;
}

House.prototype.render = function(){
	//drawRectAdj(this.x, this.y, this.w, this.h, this.outline);
	//drawRectAdj(this.x+2, this.y+2, this.w-4, this.h-4, this.color);
}

//==================== Location =========================
var LNode = function(x,y){
	Node.call(this,x,y,2);
	this.color = LOCATION_COLOR;
	this.outline = LOCATION_OUTLINE;
	this.radius = LOCATION_RADIUS;
	locations[this.id] = this;
}

LNode.prototype.render = function(){
	drawNode(this);
}

