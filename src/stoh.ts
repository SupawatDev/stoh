import * as fs from "fs";
interface Variable {
    vName: string,
    vText: string
}
let inputSpace: string = "";
let inputFilename: string = "./example.st";
let outputSpace: string ="";
let outputFilename: string = "./out/output.html";
let variables: Variable[] = [];
let remains: string[] = [];
//declare EYE
let eye: string = "";

function Read() {
    return fs.readFileSync(inputFilename);
}
function variablize(): void {
    //signal
    //console.log("variablizing..");
    //initialize variable    
    let name: string = "";
    let text: string = "";
    //remove "var" and ";"
    eye = eye.slice(4, -1);
    //remove "space"
    eye = eye.trim();
    //begin collect the variable
    //myV = "hello world"
    let shortEye: string = "";
    for (let i = 0; i < eye.length; i++) {
        //initialize shortEye
        shortEye += eye[i];
        //check from start until get "="
        if (eye[i] === "=") {
            //clean "myV =" to "myV"
            shortEye = shortEye.slice(0, -1);
            name = shortEye.trim();
            shortEye = "";
            /*test*/
            //console.log(name+".");
        }
        //open the quotation
        else if (eye[i] === "\"") {
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
function tagilize() {
    eye = eye.trim();
    let tagName: string = "";
    let tagContent: string = "";
    let tagContentStartPos: number = 0;
    let isOpenQuote: boolean = false;
    let isOpenBracket: boolean = false;
    //get its content
    for (let j = 0; j < eye.length; j++) {
        //check if there is atr in tag.
        //first tag"content"{} is presented to class.
        //ex div(id="element1",color="black"){}.
        //if { detected => assign the tag name to remain.
        //in case use ()
        if (eye[j] === "(") {
            //set OpenBracket
            isOpenBracket = true;
            //start get tag's name
            tagName = eye.substring(0, j);
            tagContentStartPos = j+1;
        } else if (eye[j] === ")") {
            //check error
            if (tagContentStartPos === 0) {
                console.log('error! put ( at first place');
                break;
            }
            isOpenBracket = false;
            tagContent = eye.substring(tagContentStartPos, j);
            break; //stop the function after get everything
        }

        //in case use "" + preventing qouation from tag("")
        if (isOpenBracket === false) {
            if (eye[j] === "\"" && isOpenQuote === true) {
                tagContent = "class ="+eye.slice(tagContentStartPos-1,-1);
                console.log(tagContent);
                isOpenQuote=false;
                break;
            } else if (eye[j] === "\"") {
                //openQuote
                isOpenQuote = true;
                //start get tag's name
                tagName = eye.substring(0, j)
                //get startPos
                tagContentStartPos=j+1;
                //console.log(tagName);
            }


        }


        //in case without content
        if(eye[j]==="{"&&isOpenBracket===false&&isOpenQuote==false){
            tagName = eye.substring(0,j);
            break;
        }

    }
    //delete eyes after finish.
    //input contents to outputSpace.
    //input the remain.
    eye = "";
    if (tagName === "") {
        console.log("there's something wrong");
    } else {
        if(tagContent!==""){
        outputSpace += '\t'.repeat(remains.length) +"<"+`${tagName} ${tagContent}`+">" +"\n";
        }else{
            outputSpace += '\t'.repeat(remains.length)+`<${tagName}>` +"\n";
        }

        //tell the remains.
        remains.push(tagName);
    }
}

//replacing after finishing outputSpace.
function replaceVariables() {
    for (let k = 0; k < variables.length; k++) {
        outputSpace=outputSpace.toString().replace(`&${variables[k].vName}`, variables[k].vText);
    }
}
function closingTags() {
    //closing tag. ex </html>;
    console.log(remains);
    //check if ..} is blank 
    if(eye.indexOf(';')===-1&&eye.indexOf('&')===-1){
        outputSpace+="\t".repeat(remains.length-1)+`</${remains[remains.length-1]}>`;
        remains=remains.slice(0,-1);
    }
    //for 
    else{
        eye=eye.replace(/\s/g,'');
        if(eye.indexOf('&')!==-1){
            outputSpace+="\t".repeat(remains.length)+eye.slice(0,eye.length-1)+"\n";
        }else{
            outputSpace+="\t".repeat(remains.length)+eye.slice(1,eye.length-1)+"\n";
        }
        outputSpace+="\t".repeat(remains.length-1)+`</${remains[remains.length-1]}>`;
        remains=remains.slice(0,-1);
    }
    eye="";
}
function Lex(): void {
    //loop file characters
    for (let i = 0; i < inputSpace.length; i++) {
        eye = eye + inputSpace[i];
        eye = eye.trimLeft();
        //console.log('<--'+eye+'-->');

        //find variables
        if (eye.substring(0, 3) === "var" && inputSpace[i] === ";"/*TMS:ending var*/) {
            variablize();
        }
        //Begin tagging when detect "{".
        if (inputSpace[i] === "{") {
            tagilize();
        } else if (inputSpace[i] == "}") {
            //console.log(eye);
            closingTags();
            outputSpace+="\n";
        }

    }

    replaceVariables();
}


function writeToHTML(){
    const exfile = fs.createWriteStream(outputFilename);
    exfile.once('open',function(fd){
        exfile.write(outputSpace);
        exfile.end();
    }
    );
}




function onRun(): void {
    inputSpace = Read().toString();
    Lex();
    //console.log(outputSpace);   
    writeToHTML();
}


console.time();
onRun();
console.timeEnd();