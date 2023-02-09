var immediateClockUpdate=false;
var clockRadius=20;
var viewingClocksY=0;
var rocketLeft=150;
var rocketTop=0;
var rocketVelocityInit=0;
var rocketVelocity=rocketVelocityInit;
var clockVelocity=10;
var acceleration=1;
var t=0;
var uClockXcenter=150;
var uClockYcenter=20;
var lClockXcenter=300;
var lClockYcenter=370;
var upperClock=new clock(uClockXcenter,uClockYcenter,context);
var lowerClock=new clock(lClockXcenter,lClockYcenter,context);
var clockDescending=new clock(uClockXcenter,uClockYcenter,context);
var clockAscending=new clock(uClockXcenter,uClockYcenter,context);
var leftClock=new clock(uClockXcenter,uClockYcenter,context);
var rightClock=new clock(uClockXcenter,uClockYcenter,context);
var leftClockArrived=false;
var rightClockArrived=false;
var showLeftClock=false;
var showRightClock=false;
var rightClockVisible=false;//Αυτή η μεταβλητή γίνεται true όταν θέλουμε να εμφανίζονται δύο αχνά ρολόγια
var planetLeft=-160;
var planetTop=365;
var showPlanet=true;
var useClassicalClock=false;
var photonVelFactor=1;
var maxGravity=20;
//var g=10;
var accelCaption="Ένταση βαρυτικού πεδίου";

//photon declarations
var startE=0,photonA=5;
var Lamda=15;
var photonXorigin=0,photonYorigin=0;
var S=2;
var noOfPoints=100;

//frame of reference
var userDefinedFrame=false;
var frameAngle=0;
var newOriginX=0;
var newOriginY=0;

function initialiseExperiment(){
	experimentInitialised=false;
	newOriginX=canvas.width/2;
	newOriginY=canvas.height/2;
	initGUI();
	setReferenceFrame();
	reset();
	experimentInitialised=true;
	drawScene();
}

/*function previousFrame(){
	clock1.setValue(clock1.m_Value-1);
	clock2.setValue(clock2.m_Value-1);
	ray.trailX.splice(ray.trailX.length-1,1); 
	ray.trailY.splice(ray.trailY.length-1,1);
	drawScene();
}*/

function nextFrame(){
	lowerClock.setValue(lowerClock.m_Value+1);
	//upperClock.setValue(upperClock.m_Value+1);
	var tTotalLower=lowerClock.m_Cycles*lowerClock.m_MaxValue+lowerClock.m_Value;
	var tTotalUpper=tTotalLower*Math.sqrt(1+acceleration);
	upperClock.m_Cycles=parseInt(tTotalUpper/upperClock.m_MaxValue);
	upperClock.setValue(tTotalUpper % upperClock.m_MaxValue);
    //showDebugInfo("tTotalUpper="+tTotalUpper+" , tTotalLower="+tTotalLower+" , upperClock.m_Cycles="+upperClock.m_Cycles+" , lowerClock.m_Cycles="+lowerClock.m_Cycles);
	if (!showPlanet){
		//rocketVelocity=acceleration*t;
		////////rocketVelocity=acceleration;
		gridOrigin=rocketVelocityInit*t+0.5*acceleration*Math.pow(t,2);
		//showDebugInfo("gridOrigin="+gridOrigin+" , rocketVelocityInit*t="+rocketVelocityInit*t);
		rocketVelocity=rocketVelocityInit+acceleration*t;
	}
	while (gridOrigin>=gridBase*gridStep) {
		gridOrigin-=gridBase*gridStep;
	}
	while (gridOrigin<=-gridBase*gridStep){
		gridOrigin+=gridBase*gridStep;
	}
	t++;
	//κίνηση αριστερής εικόνας
	//showDebugInfo("immediateClockUpdate="+immediateClockUpdate);
	if (immediateClockUpdate){
		clockDescending.m_Value=upperClock.m_Value;
		clockDescending.m_Cycles=upperClock.m_Cycles;
	}
	clockDescending.m_Y+=clockVelocity;//+rocketVelocity;
	if (useClassicalClock){
		if (clockDescending.m_Y>=leftClock.m_Y){
			showLeftClock=true;
			leftClock.m_Value=clockDescending.m_Value;
			leftClock.m_Cycles=clockDescending.m_Cycles;
			clockDescending.m_Y=upperClock.m_Y;
			clockDescending.m_Value=upperClock.m_Value;
			clockDescending.m_Cycles=upperClock.m_Cycles;
		}
	}
	else{
		if (photonXorigin+S*Lamda>=leftClock.m_Y-clockRadius){
			showLeftClock=true;
			leftClock.m_Value=clockDescending.m_Value;
			leftClock.m_Cycles=clockDescending.m_Cycles;
			photonXorigin=uClockYcenter+clockRadius;
			clockDescending.m_Value=upperClock.m_Value;
			clockDescending.m_Cycles=upperClock.m_Cycles;
		}
	}

	//κίνηση δεξιάς εικόνας
	if (rightClockVisible){
		clockAscending.m_Y-=clockVelocity;//-rocketVelocity;
		if (clockAscending.m_Y<=rightClock.m_Y){
			showRightClock=true;
			rightClock.m_Value=clockAscending.m_Value;
			rightClock.m_Cycles=clockAscending.m_Cycles;
			clockAscending.m_Y=lowerClock.m_Y;
			clockAscending.m_Value=lowerClock.m_Value;
			clockAscending.m_Cycles=lowerClock.m_Cycles;
		}
	}
	drawScene();
}

function reset(){
	showLeftClock=false;
	showRightClock=false;
	upperClock.m_Value=0;
	upperClock.m_Cycles=0;
	lowerClock.m_Value=0;
	lowerClock.m_Cycles=0;
	clockDescending.m_Value=0;
	clockDescending.m_Cycles=0;
	clockAscending.m_Value=0;
	clockAscending.m_Cycles=0;
	leftClock.m_Value=0;
	leftClock.m_Cycles=0;
	rightClock.m_Value=0;
	rightClock.m_Cycles=0;
	t=0;
	gridOrigin=0;
	document.getElementById("btnNextFrame").disabled=false;
	rocketTop=(canvas.height-rocket.height)/2;
	rocketLeft=(canvas.width-rocket.width)/2;
	initialiseClocks();
	photonXorigin=uClockYcenter+clockRadius;
	photonYorigin=uClockXcenter;
	
	if(acceleration==0){
		immediateClockUpdate=true;
	}
	else{
		immediateClockUpdate=false;
	}

	drawScene();
}

function drawScene(){
	if (experimentInitialised){
		clearGraphics();
		setReferenceFrame();
		showGrid();
		drawBackground();
		drawClocks();
		restoreReferenceFrame();
	}
}

function setReferenceFrame(){
	if (!userDefinedFrame){
		userDefinedFrame=true;
		context.save();
		// move the origin to center of canvas   
		context.translate(newOriginX,newOriginY); 
		context.rotate(frameAngle*Math.PI/180);
	}
}

function restoreReferenceFrame(){
	if(userDefinedFrame){
		userDefinedFrame=false;
		context.restore();
	}
}


function drawBackground(){
	if (showPlanet){
		context.globalAlpha=acceleration/maxGravity;
		context.drawImage(planet,planetLeft-newOriginX,planetTop-newOriginY);
		context.globalAlpha=1;
		context.drawImage(planetSketch,planetLeft-newOriginX,planetTop-newOriginY);
	}
    context.drawImage(rocket,rocketLeft-newOriginX,rocketTop-newOriginY);
}

function initialiseClocks(){
	var uClockXOffset=157;
	var uClockYOffset=147;
	var lClockXOffset=127;
	var lClockYOffset=130;
	upperClock.m_Value=0;
	upperClock.m_Cycles=0;
	upperClock.m_Radius=clockRadius;
	lowerClock.m_Value=0;
	lowerClock.m_Cycles=0;
	lowerClock.m_Radius=clockRadius;
	clockAscending.m_Radius=clockRadius;
	clockDescending.m_Radius=clockRadius;
	leftClock.m_Radius=clockRadius;
	rightClock.m_Radius=clockRadius;
	uClockXcenter=rocketLeft+uClockXOffset-newOriginX;//-upperClock.m_Radius;
	uClockYcenter=upperClock.m_Radius+uClockYOffset-newOriginY;
	lClockXcenter=rocketLeft+rocket.width-lClockXOffset-newOriginX;
	lClockYcenter=canvas.height-lowerClock.m_Radius-lClockYOffset-newOriginY;
	upperClock.m_X=uClockXcenter;
	upperClock.m_Y=uClockYcenter;
	lowerClock.m_X=lClockXcenter;
	lowerClock.m_Y=lClockYcenter;
	clockAscending.transparency=0.2;
	clockAscending.m_X=lowerClock.m_X;
	clockAscending.m_Y=lowerClock.m_Y;
	clockDescending.transparency=0.2;
	clockDescending.m_X=upperClock.m_X;
	clockDescending.m_Y=upperClock.m_Y;
	
	if(rightClockVisible){
		viewingClocksY=rocketTop+rocket.height/2-newOriginY;
	}
	else{
		viewingClocksY=lowerClock.m_Y;
	}
	leftClock.m_X=upperClock.m_X;
	leftClock.m_Y=viewingClocksY;
	rightClock.m_X=lowerClock.m_X;
	rightClock.m_Y=viewingClocksY;
}

function drawClocks(){
	upperClock.show();
	lowerClock.show();
	if (showLeftClock) leftClock.show();
	if (showRightClock) rightClock.show();
	if (useClassicalClock){
		clockAscending.show();
		clockDescending.show();
	}
	else if (simulating){
		drawPhoton();
	}
}

function drawPhoton(){
	var i,j,x,y;
	context.strokeStyle="#00ff00";
	context.beginPath();
	y=photonXorigin+startE*(Lamda/noOfPoints);
	x=photonYorigin+photonA*Math.sin(2*Math.PI*startE/noOfPoints);
	context.rect(x,y,1,1);
	
	for(i=startE;i<=noOfPoints;i++){
		y=photonXorigin+i*(Lamda/noOfPoints);
		x=photonYorigin+photonA*Math.sin(2*Math.PI*i/noOfPoints);
		context.rect(x,y,1,1);
	}
	for(j=1;j<=S-1;j++){
		for(i=0;i<=noOfPoints;i++){
			y=photonXorigin+j*Lamda+i*(Lamda/noOfPoints);
			x=photonYorigin+photonA*Math.sin(2*Math.PI*i/noOfPoints);
			context.rect(x,y,1,1);
		}
	}
	for(i=0;i<=startE;i++){
		y=photonXorigin+S*Lamda+i*(Lamda/noOfPoints);
		x=photonYorigin+photonA*Math.sin(2*Math.PI*i/noOfPoints);
		context.rect(x,y,1,1);
	}
	startE=startE+photonVelFactor*Lamda;//+4*clockVelocity;
	if(startE>=noOfPoints){
		startE=0;
		photonXorigin=photonXorigin+Lamda;
	}
	context.stroke();
}