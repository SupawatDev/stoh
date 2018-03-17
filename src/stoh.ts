import * as fs from "fs";
interface Variable {
    vName: string,
    vText: string
}
let content: any;
let filename: string = "./example.st";
let output: string;
let variables: Variable[]=[];


function Read() {
    return fs.readFileSync(filename);
}
function variablize(inputEye:string):Variable{
    //initialize variable    
    let fVariable:Variable;
    //remove "var" and ";"
    inputEye=inputEye.slice(4,-1);
    //remove "space"
    inputEye.trim();
    //begin collect the variable
    //myV = "hello world"
    let shortEye:string="";
    for(let i=0;i<inputEye.length;i++){
        //initialize shortEye
        shortEye+=inputEye[i];
        //check from start until get "="
        if(inputEye[i]==="="){ 
            //clean "myV =" to "myV"
            shortEye=shortEye.slice(0,-1);
            fVariable.vName=shortEye.trim();
            shortEye="";
            /*test*/
            //console.log(name+".");
        }
        //open the quotation
        else if(inputEye[i]==="\"")
        {
            shortEye=shortEye.trimLeft();
            if(shortEye.length>1){
                fVariable.vText=shortEye.slice(1,-1);

                /*test*/
                //console.log(text);
            }
        }else{
            /*test*/
            //console.log(shortEye);
        }
    }
    //push slackVariable to variables;
    return fVariable;
}
function Lex(): void {
    //declare EYE
    let eye: string = "";

    //loop file characters
    for (let i = 0; i < content.length; i++) {
        eye = eye + content[i];
        //find variables
        if (eye.substring(0, 3) === "var" && eye.substring(eye.length-1) === ";") {
            

            //delete eye after finish
            eye="";
        }else{

        }
    }

}







function onRun(): void {
    content = Read().toString();
    //console.log(content);
    Lex();
}



onRun();