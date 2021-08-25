
const dree = require('dree');
const fs = require('fs');
const path = require('path')
const Handlebars = require('handlebars');
const chalk = require('chalk');
const { Console } = require('console');

Handlebars.registerHelper('toLowerCase', function (string) {

    return string.toString().toLowerCase;
});

Handlebars.registerHelper('FirstLetterCapital', function (string) {
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
function getExplored(path) {

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
function createFileFromRelativePath(RelativePath, arguments, cmd_location) {
    //var vars = { VendorName: "MGCLI", moduleName: "Json", blockextends: undefined, blockclass: undefined };

    //Spit what by '/' what are folders and what are files
    // the last element is the file  
    let RelativePath_Arr = RelativePath.split("/");
    //console.log("...")
    //console.log(RelativePath_Arr)

    let newDirPath = ""

    for (let i = 0; i < RelativePath_Arr.length; i++) {

        //if it is a folder 
        if (i < RelativePath_Arr.length - 1) {

            newDirPath += RelativePath_Arr[i] + "/"
            // console.log("made dir:" + newDirPath)


            fs.mkdir(path.join(process.env.PWD, newDirPath), { recursive: true }, (err) => {
                if (err && err.errno == -17) {
                    return console.error("Skiped Folder Exists..." + newDirPath);
                }

            });


        }

        else {


            let newfilepath = newDirPath
            let originalFilePath = newDirPath + RelativePath_Arr[i];//index.php
            let orginal = RelativePath_Arr[i].split(".")

            let file = {

                name: orginal[0],
                encoding: "." + orginal[1]

            }
            newFileName = file.name + file.encoding
            if (arguments.keepOriginalName) {
                newFileName = file.name + file.encoding



            }

            if (arguments.blockclass != undefined && !arguments.keepOriginalName) {
                newFileName = arguments.blockclass + file.encoding
            }




            newDirPath = './' + newfilepath + newFileName
            utfpathArr = newfilepath.split("/")
            
            let safepath = ""
            utfpathArr.forEach(element => safepath = path.join(safepath, element))
            safepath = path.join(".",safepath, newFileName)
           

            let tempalteFileContent = fs.readFileSync(path.resolve(cmd_location + originalFilePath)).toString('utf8');

            let template = Handlebars.compile(tempalteFileContent);
            try {

                if (fs.existsSync(safepath)) {

                    console.log(chalk.red("FILE - EXISTS try a different name"))
                    console.log(chalk.yellow("Are you making this ? ->" + newDirPath));
                    console.log(chalk.blue("--END OF ERROR--"));
                }
                else {
                    console.log(chalk.green(safepath));
                    fs.writeFileSync(safepath, template(arguments), function (err) {
                        if (err) throw err;
                        console.log('Done');
                    });
                }
            }
            catch (err) {
                console.log("--", err);

            }
            // var TempalteLocation = realtivePath.substring(1, realtivePath.length);
            // console.log(chalk.yellow("Using Template From:" + path.resolve(cmd_location + TempalteLocation)))
            // let tempalteFileContent = fs.readFileSync(path.resolve(cmd_location + TempalteLocation)).toString('utf8');

            // let template = Handlebars.compile(tempalteFileContent);
            // try {

            //     if (fs.existsSync(newfilepath)) {

            //         console.log(chalk.red("FILE - EXISTS try a different name"))
            //         console.log(chalk.yellow("Are you making this ? ->" + newfilepath));
            //         console.log(chalk.blue("--END OF ERROR--"));
            //     }
            //     else {
            //         console.log(chalk.green(newfilepath));
            //         fs.writeFileSync(newfilepath, template(arguments), function (err) {
            //             if (err) throw err;
            //             console.log('Done');
            //         });
            //     }
            // }
            // catch (err) {
            //     console.log("--", err);

            // }


        }
    }
}

//exports.getfolderDirectories = startDigging;
exports.startDigging = startDigging;

exports.explore = explore;

exports.exploreNest = getExplored


exports.createFileFromRelativePath = createFileFromRelativePath;

exports.getRabitholeRoute = nestMap

