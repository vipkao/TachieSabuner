'use strict';

class BaseFolder {
    constructor() {
    };    
    build(path, base, layer, suffix){
        let ret;
        if(layer === ""){
            ret = `${path}${base}.${suffix}`;
        }else{
            ret = `${path}${base}/${layer}.${suffix}`;
        }
        return ret;
    }
};

export default BaseFolder;
