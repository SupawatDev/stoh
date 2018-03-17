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
var content;
var filename = "./example.st";
var output;
var variables = [];
function Read() {
    return fs.readFileSync(filename);
}
function variablize(inputEye) {
    //initialize variable    
    var fVariable;
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
            fVariable.vName = shortEye.trim();
            shortEye = "";
            /*test*/
            //console.log(name+".");
        }
        else if (inputEye[i] === "\"") {
            shortEye = shortEye.trimLeft();
            if (shortEye.length > 1) {
                fVariable.vText = shortEye.slice(1, -1);
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
    return fVariable;
}
function Lex() {
    //declare EYE
    var eye = "";
    //loop file characters
    for (var i = 0; i < content.length; i++) {
        eye = eye + content[i];
        //find variables
        if (eye.substring(0, 3) === "var" && eye.substring(eye.length - 1) === ";") {
            //delete eye after finish
            eye = "";
        }
        else {
        }
    }
}
function onRun() {
    content = Read().toString();
    //console.log(content);
    Lex();
}
onRun();
