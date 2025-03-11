import fs from 'fs';    //controlling file system with this package
import path from 'path';

export const fileRemover = (filename) => {
    fs.unlink(path.join(__dirname, '../uploads', filename), function(err){
        if(err && err.code == "ENOENT"){
            //FILE DOESN'T EXIST
            console.log(`file ${filename} doesn't exist, won't remove it.`);
        } else if(err){
            console.log(`Error occured while trying to remove file ${filename}`);
        } else{
            console.log(`removed ${filename}`);
        }
    })
}

