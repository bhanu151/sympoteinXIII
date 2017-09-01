// Core L-System and Turtle implementation. As per Daniel Schiffman.
// This code also implements a User Interface.
// Users should be able to make up their own rules and see the outcome.
// Limits of the rules should be explained to the user, so that they don't use arbitrary letters.


// Need to figure how to organize the entire applet into something that adjusts itself easily. This is currently a nightmare, because if the browser works on a different scale of pixels, things might look ugly! This might be true of when people use their phones.

// Should perhaps also give some warnings that can cause the program to crash. That is something to be concerned about.

var input_axiom, input_rule, input_initial_length, input_angle;

var default_axiom, default_len, default_angle;

var axiom = "F";
default_axiom = axiom;
var sentence = axiom;
var len = 100;
default_len = len;
var angle = 30;
default_angle = angle;
var rules = [];
var randomize = false;
var randomize_each = false;

rules[0] = {
	a: "F",
	b: "FF+[+F-F-F]-[-F+F+F]"
}

function generate(){
	var nextSentence = "";
	for (var i = 0; i < sentence.length; i++) {
		var current = sentence.charAt(i);
		var found = false;
		for (var j = 0; j < rules.length; j++){
			if (current == rules[j].a){
				found = true;
				nextSentence += rules[j].b;
				break;
			}
		}
		if (!found){
			nextSentence += current;
		}
	}
	sentence = nextSentence;
	createP(sentence);
	turtle();
}

function turtle(){
	len *= 0.5;	
	translate(width/2, height);
	if (randomize) {
		angle = random(1, 180);
	}
	var angle_rads = radians(angle);
	// resetMatrix();
	for (var i=0; i < sentence.length; i++){
		var current = sentence.charAt(i);
		
		if (randomize_each) {
			angle = angle = random(1, 180);
		}

		var angle_rads = radians(angle);
		
		if (current == "F"){
			line(0, 0, 0, -len);
			translate(0, -len);
		}
		else if (current == "+"){
			rotate(angle_rads);
		}
		else if (current == "-"){
			rotate(-angle_rads)
		}
		else if (current == "["){
			push();
		}
		else if (current == "]"){
			pop();
		}
	}
}

function input(){
	clear();
	background(80);
	stroke(255, 100);

	axiom = input_axiom.value();
	createP(axiom);
	sentence = axiom;
	rules[0] = {
		a: "F",
		b: input_rule.value()
	}
	len = int(input_initial_length.value());
	angle = input_angle.value();
	if (angle == "RANDOM") {
		randomize = true;
	} else if (angle == "random"){
		randomize_each = true;
	} else {
		angle = int(angle);
		randomize = false;
		randomize_each = false;
	}
}


function reset(){
	axiom = default_axiom;
	sentence = axiom;
	len = default_len;
	angle = default_angle;
	rules[0] = {
		a: "F",
		b: "FF+[+F-F-F]-[-F+F+F]"
	}

	clear();
	canvas.background(80);
	stroke(255, 100);
	createP(axiom);

	input_axiom.value(axiom);
	input_rule.value(rules[0].b);
	input_initial_length.value(str(len));
	input_angle.value(str(angle));
}


function setup(){
	canvas = createCanvas(500, 500);
	canvas.background(80);
	stroke(255, 100);
	createP(axiom);

	var input_x = width + 240;
	var input_y = height/3.5;
	
	var instructions_heading = createElement('h2', 'L-Systems - Instructions');
	instructions_heading.position(input_x - 200, 0);

	var instructions = "In order to generate your own L-systems and visualize their output, enter the following parameters into the fields below: <br><br> 1. Starting point - This is the first set of instructions - the <i>base trunk</i> of the tree. <br> 2. Rules - This is the most important part. Use only the following letters to get anything reasonable out of the demo - F: Move forward ; +: Rotate clockwise ; -: Rotate anti-clockwise; [: Save current location; ]: Restore to previous location. <br> 3. Starting length - The length of the base of the tree, in pixels. <br> 4. Rotation angle - The angle of rotation in degrees. Enter RANDOM if you want to randomize this value once every iteration. Enter random if you want to randomize angle within an iteration.";

	var instructions_text = createP(instructions);
	instructions_text.position(instructions_heading.x, instructions_heading.y + 40);


	var input_axiom_text = createElement('h4', 'Enter the start point: ');
	input_axiom_text.position(input_x - 180, input_y + 75);
	
	// INPUT AXIOM
	input_axiom = createInput(default_axiom);
	input_axiom.position(input_x + 20, input_axiom_text.y + 20);
	
	var input_rule_text = createElement('h4', 'Enter the rule: ');
	input_rule_text.position(input_axiom_text.x, input_axiom_text.y + 40);
	
	// INPUT RULE
	input_rule = createInput("FF+[+F-F-F]-[-F+F+F]");
	input_rule.position(input_axiom.x, input_axiom.y + 40);

	var input_initial_length_text = createElement('h4', 'Enter the starting length: ');
	input_initial_length_text.position(input_axiom_text.x, input_rule_text.y + 40);
	
	// INPUT INITIAL LENGTH
	input_initial_length = createInput(default_len);
	input_initial_length.position(input_axiom.x, input_rule.y + 40);

	var input_angle_text = createElement('h4', 'Enter the angle of rotation: ');
	input_angle_text.position(input_initial_length_text.x, input_initial_length_text.y + 40);
	// INPUT ROTATION ANGLE
	input_angle = createInput(default_angle);
	input_angle.position(input_axiom.x, input_initial_length.y + 40);

	var input_button = createButton("Input");
	input_button.position(input_x - 100, input_angle.y + 40);
	input_button.mousePressed(input);

	var generate_button = createButton("Generate");
	generate_button.position(input_button.x + 80, input_button.y);
	generate_button.mousePressed(generate);

	var reset_button = createButton("Reset");
	reset_button.position(generate_button.x + 100, input_button.y);
	reset_button.mousePressed(reset);
}