"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var inputSpace = "";
var inputFilename = "./example.st";
var outputSpace;
var outputFilename = "./out/output.html";
var variables = [];
var remains = [];
//declare EYE
var eye = "";
function Read() {
    return fs.readFileSync(inputFilename);
}
function variablize(inputEye) {
    //signal
    //console.log("variablizing..");
    //initialize variable    
    var name = "";
    var text = "";
    //remove "var" and ";"
    inputEye = inputEye.slice(4, -1);
    //remove "space"
    inputEye.trim();
    //begin collect the variable
    //myV = "hello world"
    var shortEye = "";
    for (var i = 0; i < inputEye.length; i++) {
        //initialize shortEye
        shortEye += inputEye[i];
        //check from start until get "="
        if (inputEye[i] === "=") {
            //clean "myV =" to "myV"
            shortEye = shortEye.slice(0, -1);
            name = shortEye.trim();
            shortEye = "";
            /*test*/
            //console.log(name+".");
        }
        else if (inputEye[i] === "\"") {
            shortEye = shortEye.trimLeft();
            if (shortEye.length > 1) {
                text = shortEye.slice(1, -1);
                /*test*/
                //console.log(text);
            }
        }
        else {
            /*test*/
            //console.log(shortEye);
        }
    }
    //push slackVariable to variables;
    //delete eye after finish
    eye = "";
    variables.push({ vName: name, vText: text });
}
function tagilize(inputEye) {
    inputEye = inputEye.trimLeft();
    var tagName = "";
    var tagContent = "";
    var tagContentStartPos = 0;
    //get its content
    for (var j = 0; j < inputEye.length; j++) {
        //check if there is atr in tag.
        //first tag"content"{} is presented to class.
        //ex div(id="element1",color="black"){}.
        //if { detected => assign the tag name to remain.
        //in case use ()
        if (inputEye[j] === "(") {
            //start get tag's name
            tagName = inputEye.substring(0, j);
            console.log('tagging:' + tagName);
            tagContentStartPos = j + 1;
        }
        else if (inputEye[j] === ")") {
            //check error
            if (tagContentStartPos === 0) {
                console.log('error! put ( at first place');
                return;
            }
            tagContent = inputEye.substring(tagContentStartPos, j);
        }
        //
    }
    //delete eyes after finish.
    //input contents to outputSpace.
    //input the remain.
    eye = "";
    if (tagName === "") {
        console.log("there's something wrong");
    }
    else {
        outputSpace += "<" + tagName + " " + tagContent + ">";
        remains.push(tagName);
    }
}
//replacing after finishing outputSpace.
function replaceVariables() {
    for (var k = 0; k < variables.length; k++) {
        outputSpace.replace("&" + variables[k], variables[k].vText);
    }
}
function closingTags() {
    //closing tag. ex </html>
    if (remains.length === 1) {
        outputSpace += "</" + remains[0] + ">";
    }
    else {
        outputSpace += "</" + remains[-1] + ">";
    }
}
function Lex() {
    //loop file characters
    for (var i = 0; i < inputSpace.length; i++) {
        eye = eye + inputSpace[i];
        eye = eye.trimLeft();
        //console.log('<--'+eye+'-->');
        //find variables
        if (eye.substring(0, 3) === "var" && inputSpace[i] === ";" /*TMS:ending var*/) {
            variablize(eye);
        }
        //Begin tagging when detect "{".
        if (inputSpace[i] === "{") {
            tagilize(eye);
        }
        else if (inputSpace[i] == "}") {
        }
    }
    console.log(outputSpace);
    replaceVariables();
}
function onRun() {
    inputSpace = Read().toString();
    Lex();
}
onRun();
