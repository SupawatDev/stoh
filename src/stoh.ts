import * as fs from "fs";
interface Variable {
    vName: string,
    vText: string
}
let inputSpace: string = "";
let inputFilename: string = "./example.st";
let outputSpace: string;
let outputFilename: string = "./out/output.html";
let variables: Variable[] = [];
let remains: string[] = [];
//declare EYE
let eye: string = "";

function Read() {
    return fs.readFileSync(inputFilename);
}
function variablize(inputEye: string): void {
    //signal
    //console.log("variablizing..");
    //initialize variable    
    let name: string = "";
    let text: string = "";
    //remove "var" and ";"
    inputEye = inputEye.slice(4, -1);
    //remove "space"
    inputEye.trim();
    //begin collect the variable
    //myV = "hello world"
    let shortEye: string = "";
    for (let i = 0; i < inputEye.length; i++) {
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
        //open the quotation
        else if (inputEye[i] === "\"") {
            shortEye = shortEye.trimLeft();
            if (shortEye.length > 1) {
                text = shortEye.slice(1, -1);

                /*test*/
                //console.log(text);
            }
        } else {
            /*test*/
            //console.log(shortEye);
        }
    }
    //push slackVariable to variables;
    //delete eye after finish
    eye = "";
    variables.push({ vName: name, vText: text });
}
function tagilize(inputEye: string) {
    inputEye = inputEye.trimLeft();
    let tagName: string = "";
    let tagContent: string = "";
    let tagContentStartPos: number = 0;
    //get its content
    for (let j = 0; j < inputEye.length; j++) {
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
        } else if (inputEye[j] === ")") {
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
    } else {
        outputSpace += `<${tagName} ${tagContent}>`;
        remains.push(tagName);
    }
}

//replacing after finishing outputSpace.
function replaceVariables() {
    for (let k = 0; k < variables.length; k++) {
        outputSpace.replace(`&${variables[k]}`, variables[k].vText);
    }
}
function closingTags() {
    //closing tag. ex </html>
    if (remains.length === 1) {
        outputSpace += `</${remains[0]}>`;
    } else {
        outputSpace += `</${remains[-1]}>`;
    }
}
function Lex(): void {
    //loop file characters
    for (let i = 0; i < inputSpace.length; i++) {
        eye = eye + inputSpace[i];
        eye = eye.trimLeft();
        //console.log('<--'+eye+'-->');

        //find variables
        if (eye.substring(0, 3) === "var" && inputSpace[i] === ";"/*TMS:ending var*/) {
            variablize(eye);
        }
        //Begin tagging when detect "{".
        if (inputSpace[i] === "{") {
            tagilize(eye);
        } else if (inputSpace[i] == "}") {

        }

    }

    console.log(outputSpace);
    replaceVariables();
}







function onRun(): void {
    inputSpace = Read().toString();
    Lex();
}



onRun();