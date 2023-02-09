//controls
var minAccelValue=1;
var gui=new dat.GUI();
var simSwitch,simulationSpeed,orientation,showGrd,grdStep,planetVisible,classicalClock,photonVelocityFactor,vel,accel;

var controls=function() {
	this.simulationSwitch=false;
	this.simulationSpeed=simSpeed;
	this.orientation=frameAngle;
	this.showGrid=gridVisible;
	this.gridStep=gridStep;
	this.planetVisible=true;
	this.classicalClock=useClassicalClock;
	this.photonVelocityFactor=photonVelFactor;
    this.vel=rocketVelocity;
	this.accel=acceleration;
};
var cntrls=new controls();

function initGUI(){
	
	if (simSwitch){
		gui.remove(simSwitch);
		simSwitch=null;
	}
	if (simulationSpeed){
		gui.remove(simulationSpeed);
		simulationSpeed=null;
	}
	if (orientation){
		gui.remove(orientation);
		orientation=null;
	}
	if (showGrd){
		gui.remove(showGrd);
		showGrd=null;
	}
	if (grdStep){
		gui.remove(grdStep);
		grdStep=null;
	}
	if (planetVisible){
		gui.remove(planetVisible);
		planetVisible=null;
	}
	if (classicalClock){
		gui.remove(classicalClock);
		classicalClock=null;
	}
	if (photonVelocityFactor){
		gui.remove(photonVelocityFactor);
		photonVelocityFactor=null;
	}	
	if (accel){
		gui.remove(accel);
		accel=null;
	}
	gui.width=350;	

    simSwitch=gui.add(cntrls,"simulationSwitch").listen().name("Προσομοίωση");
    simSwitch.onChange(function(newValue){
    	simulating=newValue;
    	handleTimer(simulating);
    	if (newValue) reset();
    });

	simulationSpeed=gui.add(cntrls,"simulationSpeed",1,20).step(1).name("Βραδύτητα προσομοίωσης");
	simulationSpeed.onChange(function(newValue){
		simSpeed=newValue;
		defineSimulationSpeed();
    });
	
	orientation=gui.add(cntrls,"orientation",0,360).step(1).name("Προσανατολισμός");
	orientation.onChange(function(newValue){
		frameAngle=newValue;
		drawScene();
    });

	showGrd=gui.add(cntrls,"showGrid").listen().name("Πλέγμα");
	showGrd.onChange(function(newValue){
		gridVisible=newValue;
		drawScene();
	});
	
	grdStep=gui.add(cntrls,"gridStep",1,5).step(1).name("Βήμα πλέγματος");
	grdStep.onChange(function(newValue){
		gridStep=newValue;
		drawScene();
    });

	planetVisible=gui.add(cntrls,"planetVisible").listen().name("Βαρυτικό πεδίο");
	planetVisible.onChange(function(newValue){
		showPlanet=newValue;
		if (showPlanet){
			//yAcceleration=0.05;
			accelCaption="Ένταση βαρυτικού πεδίου";
			minAccelValue=1;
		}
		else{
			//yAcceleration=0;
			accelCaption="Επιτάχυνση πυραύλου";
			minAccelValue=0;
		}
		reset();
		initGUI();
	});
	
	classicalClock=gui.add(cntrls,"classicalClock").listen().name("'Κλασσικό' ρολόι");
	classicalClock.onChange(function(newValue){
		useClassicalClock=newValue;
		reset();
		initGUI();
	});
	
	if (!useClassicalClock && handlePhotonSpeedSeparately){
		photonVelocityFactor=gui.add(cntrls,"photonVelocityFactor",1,5).step(1).name("'Ταχύτητα' φωτονίου");
		photonVelocityFactor.onChange(function(newValue){
			photonVelFactor=newValue;
			drawScene();
		});
	}

	if (!showPlanet){
		vel=gui.add(cntrls,"vel",-5,5).step(1).name("Ταχύτητα πυραύλου");
		vel.onChange(function(newValue){
			rocketVelocityInit=newValue;
			drawScene();
		});
	}
	
	accel=gui.add(cntrls,"accel",minAccelValue,maxGravity).step(1).name(accelCaption);
	accel.onChange(function(newValue){
		acceleration=newValue;
		if(acceleration==0){
			immediateClockUpdate=true;
		}
		else{
			immediateClockUpdate=false;
		}
		showLeftClock=false;
		showRightClock=false;
		reset();
    });
}