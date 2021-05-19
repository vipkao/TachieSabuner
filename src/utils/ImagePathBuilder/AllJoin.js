'use strict';

class AllJoin {
    constructor() {
    };    
    build(path, base, layer, suffix){
        var ret = `${path}${base}${layer}.${suffix}`;
        return ret;
    }
};

export default AllJoin;
