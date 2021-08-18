
const dree = require('dree');
const fs = require('fs');
const path = require('path')
const Handlebars = require('handlebars');
const chalk = require('chalk');

Handlebars.registerHelper('toLowerCase', function(string) {
       
        return  string.toString.toLowerCase;
      });
    
    Handlebars.registerHelper('FirstLetterCapital',  function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      });




/**
 * 
 * @param {*} path of a the Nest Folder
 * 
 * @returns [] an array of the 1st childer ./path [ dir1 , dir2] 
 */
const startDigging = (path) => {

    let tree = dree.scan(path);
    return tree.children;

}

// this might cause an issue 
var nestMap = []


function Remember(path) {
    //Remeber the way back
    nestMap.push(path)
}
/**
 * 
 * @param {object} obj - of the dree childer array
 * recursive function that searches directories
 * 
 *  
 */

function explore(obj, callback) {
    
    //if directory keep exploring
    if (obj.type === "directory") {
        if (obj.children !== undefined) {
            let children = obj.children;
            for (let i = 0; i < children.length; i++) {

                explore(children[i])
            }
        }
        else {
            //console.log("ded end")
        }
    }
    else {
        //console.log("file for path " + obj.path);
        Remember(obj.relativePath)

    }


}
/**
 * 
 * @param {*} path 
 * @returns [] of relativeFilepaths
 */
function getExplored(path){
    
    let subpath = startDigging(path)
    subpath.forEach(explore);
    console
    return nestMap

}

/**
 * 
 * @param {string} RelativePath 
 * @param {object} for handlebars
 * @param {string} cmd_location location of the script 
 */
function createFileFromRelativePath(RelativePath, arguments ,cmd_location ) {
    
    //Spit what by '/' what are folders and what are files
    // the last element is the file  
    let RelativePath_Arr = RelativePath.split("/");
    //console.log("...")
    //console.log(RelativePath_Arr)

    let newDirPath = './'
    //itterate throught the input 
    for (let i = 0; i < RelativePath_Arr.length; i++) {
        //console.log(RelativePath_Arr[i]);
        //if it is a folder 
        if (i < RelativePath_Arr.length-1  ) {

            newDirPath += RelativePath_Arr[i] + "/"
          

            fs.mkdir(path.join(process.env.PWD, newDirPath), { recursive: true }, (err) => {
                if (err && err.errno == -17) {
                    return console.error("Skiped Folder Exists..." + newDirPath);
                }

            });
        
        
     }

        else{
           
            
            let newfilepath=newDirPath
            newDirPath+=RelativePath_Arr[i];//index.php
            let file={
                name:RelativePath_Arr[i].split(".")[0],
                encoding:"."+RelativePath_Arr[i].split(".")[1]
                }
             
            if(arguments.blockclass!=undefined){
            newFileName=arguments.blockclass
            newfilepath+=newFileName+file.encoding}
            else{
                newfilepath=RelativePath_Arr[i]
            }

            let TempalteLocation = newDirPath.substring(1, newDirPath.length);
            let tempalteFileContent = fs.readFileSync(path.resolve(cmd_location + TempalteLocation)).toString('utf8');
            
            let template=Handlebars.compile(tempalteFileContent);
            try{
                
                if (fs.existsSync(newfilepath)) {
                    if(arguments.blockclass==undefined){
                    console.log(chalk.red("FILE EXISTS \n If you are using --Register the file has been made"))
                    }else {
                    console.log(chalk.red("FILE EXISTS try a different name"))}
                }
                else{
                    fs.writeFileSync(newfilepath, template(arguments), function (err) {
                        if (err) throw err;
                        console.log('Done');
                    });
                }
            }
            catch(err){
                console.log(err);
            }
        

        }
}
}

//exports.getfolderDirectories = startDigging;
exports.startDigging = startDigging;

exports.explore = explore;

exports.exploreNest= getExplored


exports.createFileFromRelativePath = createFileFromRelativePath;

exports.getRabitholeRoute = nestMap

