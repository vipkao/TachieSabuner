'use strict';

import Observer from '../utils/Observer';

const Dispatcher = function(){
    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    this.dispatch = function(payload){
        if(!payload){
            console.trace();
            throw new Error('payload broken.');
        }
        _raiseEvent(payload);
    };
};
export default Dispatcher;
