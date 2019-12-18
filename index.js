var url = new URL(location.href);
var playerid = url.searchParams.get("id");

var highScore = 0;

function refresh() {

	interval = requestAnimationFrame(refresh)

	currentTime = (new Date()).getTime()
	delta = currentTime - lastTime;

	if(delta < INTERVAL)
		return;

	lastTime = currentTime - (delta % INTERVAL)

	screenYSpeed *= timeConstant

	let ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, windowWidth, windowHeight)

	fly.acceleration.x = 0//desiredX;
	fly.acceleration.y = -gravity*(INTERVAL/33);
/*
	if(Math.abs(desiredX) < 0.05) 
		fly.velocity.x /= 2 
*/
	for(var i=0; i<objects.length; i++) {

		let object = objects[i]

		screenYSpeed = 20*Math.pow((fly.y)/windowHeight, 2) + 2


		object.y -= screenYSpeed;

		if(object.y > windowHeight+300)
			continue

		if(object.y < -200) {
			objects.splice(i, 1);
			score++;
			continue;
		}

		if(object.speed != 0) {
			object.move(timeConstant);
		}

		if(object.x - object.width/2 < 0)
			object.speed *= -1
		if(object.x + object.width/2 > windowWidth) 
			object.speed *= -1

		if((Math.pow(fly.x - object.x, 2) <= Math.pow(object.width/2, 2)) && (Math.pow(fly.y - object.y, 2) <= Math.pow(object.height , 2)) && (fly.velocity.y < 0)) {
			//objects.splice(i, 1)
			fly.acceleration.y += object.boost
			fly.velocity.y = 0

			if(objects.length < 5 && fly.acceleration.y == 9-(gravity*(INTERVAL/33))) {
				fly.acceleration.y += 7;
				score += objects.length
				spawn(2000);
			}
		}

		ctx.fillStyle = object.color;
		ctx.fillRect(object.x - object.width/2, windowHeight - (object.y + object.height/2), object.width, object.height);
	}

	fly.velocity.x += fly.acceleration.x
	fly.velocity.y += fly.acceleration.y

	fly.x = mouseX
	fly.y += fly.velocity.y*timeConstant;

	fly.y -= screenYSpeed;

	if(fly.x > windowWidth)
		fly.x = 0;
	if(fly.x < 0)
		fly.x = windowWidth

	ctx.beginPath();
	ctx.fillStyle = selectedPalette.ballColor;
	ctx.arc(fly.x, windowHeight - fly.y, flyRadius, 0, 2*Math.PI)
	ctx.fill();

	if(fly.y < -200) {
		stop()
		if(score > highScore) {
			highScore = score
			var xmlhttp = new XMLHttpRequest();
             var url = "https://zhezhokchaj.herokuapp.com/highscore/" + highScore + 
                 "?id=" + playerid;
             xmlhttp.open("GET", url, true);
             xmlhttp.send();
		}
	} 

	if(mobile)
		document.getElementById("score").style.left = (windowWidth - 10 - document.getElementById("score").offsetWidth) + "px"
	else 
		document.getElementById("score").style.left = ((wholeWW - windowWidth)/2 + 500 - 10 - document.getElementById("score").offsetWidth) + "px"

	document.getElementById("score").innerHTML = score
}

function normalize(vector) {
	let length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	return {
		x: vector.x/length,
		y: vector.y/length
	}
}

function length(vector) {
	return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

function Object(y) {
	this.y = y;
	this.color = (typeof(selectedPalette.objectsColor) == "function") ? selectedPalette.objectsColor() : selectedPalette.objectsColor
	this.height = platformHeight;
	this.boost = 5 + Math.random()/2;
	this.width = (Math.random()*30+120)/((score+100)/100)/scaling;
	this.speed = 0;
	this.x = Math.random()*(windowWidth-this.width)+this.width/2;
	if(Math.random() < 0.3*Math.pow((score+100)/100, 2)) {
		this.speed = (Math.random()-0.5)*2*((score+100)/100)
		this.move = (timeConstant) => {
			this.x += this.speed*timeConstant;
		}
	} 
	if(objects.length % 20 == 0) {
		this.width = windowWidth;
		this.boost = 9;
		this.x = windowWidth/2;
		this.speed = 0
		this.y += 10
		this.height = 30
	}
}

function spawn(offset) {
	objects = [];
	for(var i=0; i<61; i++) {
		objects.push(new Object((offset+i*(160+10))))
	}
}

function paintElements() {
	
	document.getElementById("screen").style.backgroundColor 		= selectedPalette.backgroundColor   
	document.getElementById("settingsScreen").style.backgroundColor = selectedPalette.backgroundColor   
	
	let elements = ["bounceText", "start", "score", "gameOverText", "scoreText", "result", "restart", "settingsButton", "settingsText", "settingsField1", "settingsField2", "exitSettings"]
	          
	for(var i = 0; i<elements.length*2; i++) {
		if(i % 2 == 0) {
			document.getElementById(elements[Math.floor(i/2)]).style.color = selectedPalette.elements[i]
		}
		else {
			document.getElementById(elements[Math.floor(i/2)]).style.backgroundColor = selectedPalette.elements[i]
		}
	}
}