
const dree = require('dree');
const fs = require('fs');
const path = require('path')

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

var nestMap = []

function Remember(path) {
    //Remeber the way back
    nestMap.push(path)
}
/**
 * 
 * @param {object} obj - of the dree childer array
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
function explored(path){
    let subpath = startDigging(path)
    subpath.forEach(explore)

  

  //console.log(fileRabit.getTempalateFileList);
  let list = fileRabit.getRabitholeRoute

}

/**
 * 
 * @param {string} RelativePath 
 * @param {string} cmd_location location of the script 
 */
function createFileFromRelativePath(RelativePath, cmd_location) {
    //Spit what by '/' what are folders and what are files
    // the last element is the file  
    RelativePath_Arr = RelativePath.split("/");
    //console.log("...")
    console.log(RelativePath_Arr)

    let newDirPath = './'
    //itterate throught the input 
    for (let i = 0; i < RelativePath_Arr.length; i++) {
        //console.log(RelativePath_Arr[i]);
        //if it is a folder 
        if (i < RelativePath_Arr.length - 1) {

            newDirPath += RelativePath_Arr[i] + "/"
            //console.log('mkdir : "' + newDirPath + '"');

            fs.mkdir(path.join(process.env.PWD, newDirPath), { recursive: true }, (err) => {
                if (err && err.errno == -17) {
                    return console.error("Skiped Folder Exists..." + newDirPath);
                }

            });
        } else {
            newDirPath += RelativePath_Arr[i]
            console.log('Saved file under:')
            console.log(newDirPath)
            let TempalteLocation = newDirPath.substring(1, newDirPath.length);
            let tempalteFileContent = fs.readFileSync(path.resolve(cmd_location + "/Templates/Plugin/MG_CLI/plug-in-name/" + TempalteLocation)).toString('utf8')
            fs.writeFileSync(newDirPath, tempalteFileContent, function (err) {
                if (err) throw err;
                console.log('Done');
            });
        }

    }
}

//exports.getfolderDirectories = startDigging;
exports.startDigging = startDigging;

//exports.recurisive_dis = explore;
exports.explore = explore;

exports.exploreNest= explored


exports.createFileFromRelativePath = createFileFromRelativePath;

exports.getRabitholeRoute = nestMap

