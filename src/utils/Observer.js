'use strict';

const Observer = function(){
    var _listeners = [];
    this.addListener = function(callback){
        _listeners.push(callback);
    };
    this.removeListener = function(callback){
        for(var i = _listeners.length; i-- > 0;){
            if(_listeners[i] === callback){
                _listeners.splice(i, 1);
                break;
            }
        }
    };
    this.raiseEvent = function(data){
        _listeners.forEach(function(callback){
            callback(data);
        });
    };
    this.dispose = function(){
        _listeners = [];
    };
};
export default Observer;
