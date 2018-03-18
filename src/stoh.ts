import * as fs from "fs";
interface Variable {
    vName: string,
    vText: string
}
let inputSpace: string = "";
//default input directory: './fin/'
let dir:string = process.cwd()+"\\";
let inputFileName: string = process.argv[2]||"index.st";
let outputFileName: string = process.argv[3]||"index.html";
let variables: Variable[] = [];
let remains: string[] = [];
let remainsInput:string[] =[];
// files location
const inputLoc: string = dir+inputFileName;
const outputLoc: string = dir + outputFileName;
let outputFile: fs.WriteStream; //fs.createWriteStream(outputLoc);
//declare EYE
let eye: string = "";
console.log(process.argv[2],process.argv[3]);

console.log("-----------------------------");
console.log('[ STOH | Simple Text to HTML]');
function Read() {
    return fs.readFileSync(inputLoc);
}
function variablize(): void {
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
                //console.log(tagContent);
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
        outputFile.write('\t'.repeat(remains.length) +"<"+`${tagName} ${tagContent}`+">" +"\n");
        }else{
            outputFile.write('\t'.repeat(remains.length)+`<${tagName}>` +"\n");
        }

        //tell the remains.
        remains.push(tagName);
    }
}

function closingTags() {
    //closing tag. ex </html>;
    //console.log(remains);
    //check if ..} is blank 
    eye=eye.trim();
    if(eye.indexOf(';')===-1&&eye.indexOf('&')===-1){
        outputFile.write("\t".repeat(remains.length-1)+`</${remains[remains.length-1]}>`);
        remains=remains.slice(0,-1);
    }
    //for variables and contents. 
    else{
        if(eye[0]=="&"/*variable*/){
            let replaceVar:string="";
            let found:boolean=false;
            //eye=eye.trimRight();
            for(let c=0;c<variables.length;c++){
                //case of &var;text
                if(variables[c].vName===eye.slice(1,eye.length-1)){
                    replaceVar=variables[c].vText;
                    found=true;
                    break;
                }
                if(c==variables.length-1){
                    console.log(eye.trim().replace(/(\r\n\t|\n|\r\t)/gm,'')+" has not set the variable.");
                }
            }
            if(replaceVar===""&&found===true){
                console.log("don't forget to the the varible content on " + eye.slice(0,eye.length-1));
            }
            outputFile.write("\t".repeat(remains.length)+replaceVar+"\n");
        }else{
            outputFile.write("\t".repeat(remains.length)+eye.slice(1,eye.length-1)+"\n");
        }

        outputFile.write("\t".repeat(remains.length-1)+`</${remains[remains.length-1]}>`);
        remains=remains.slice(0,-1);
    }
    eye="";
}
function Lex(): void {
    //loop file characters
    let outside:boolean = true; //prevent in html varibilzie
    for (let i = 0; i < inputSpace.length; i++) {
        eye = eye + inputSpace[i];
        eye = eye.trimLeft();
        //console.log('<--'+eye+'-->');
        //find variables
        
        if ( outside===true && inputSpace[i] === ";"/*TMS:ending var*/) {
            if(eye.substring(0, 3) === "var"){
            variablize();
            }else if(eye.substring(0,3) === "css" || eye.substring(0,3) === "js"){

            }
        }



        //Begin tagging when detect "{".
        if (inputSpace[i] === "{") {
            tagilize();
            outside=false;
        } else if (inputSpace[i] == "}") {
            //console.log(eye);
            closingTags();
            outputFile.write("\n");
            outside=false
        }

    }

}



function onRun(): void {
    outputFile = fs.createWriteStream(outputLoc);
    inputSpace = Read().toString();
    console.time();
    Lex();
    console.timeEnd();
    outputFile.close(); 
}


//Run After comply and Run if File is changed
onRun();
fs.watch(dir, (eventType, filename) => {
    if(filename==inputFileName&&eventType=="change"){
        onRun();
    }

});

