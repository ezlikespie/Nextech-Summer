//-----------------------------------------------------------------
//				  Written by Ethan Zentz - 6/16/2020
//			  Nextech Summer Coding Competition Submission
//-----------------------------------------------------------------

var entities = {};
var activities = {};
var people = {};

const COMMUNITY_RADIUS = 125;
const COMMUNITY_SIZE_MIN = 10;
const COMMUNITY_SIZE_MAX = 20;

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

//==================== Spawn Nodes ===========================
function spawnNodes(){
	//community center locations
	let communities = [width/2-500, width/2, width/2+500];
	for(const i in communities){
		let communityX = communities[i];
		let communityY = height/2;
		new ANode(communities[i], height/2);
		let communitySize = Math.round(Math.random()*(COMMUNITY_SIZE_MAX-COMMUNITY_SIZE_MIN)+COMMUNITY_SIZE_MIN);
		for(var n = 0; n<communitySize; n++){
			new PNode(communityX+Math.round(COMMUNITY_RADIUS*Math.cos(n*Math.PI*2/communitySize)), communityY+Math.round(COMMUNITY_RADIUS*Math.sin(n*Math.PI*2/communitySize)));
		}
	}
}

//==================== Node Class ========================
var Node = function(x,y,type){
	this.id = create_UUID();
	this.x = x;
	this.y = y;
	this.houseX = x;
	this.houseY = y;
	this.type = type;
	this.radius = 10;
	this.color = "black";
	this.outline = "black";
	entities[this.id] = this;
}

Node.prototype.render = function(){}

//==================== P Node =============================
var PNode = function(x,y){
	Node.call(this, x, y, "P");
	this.color = "#34b7eb"
	this.outline = "#005b80"
	this.CONST_ITCH = Math.random()*100;
	this.currentItch = 0;
	people[this.id] = this;
}

PNode.prototype.update(){
	this.currentItch+=this.CONST_ITCH;
	
}

var ANode = function(x,y){
	Node.call(this, x, y, "A");
	this.color = "#eb4334"
	this.outline = "#911307"
	this.radius = 20;
	activities[this.id] = this;
}