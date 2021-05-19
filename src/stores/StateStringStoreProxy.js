'use strict';

import Observer from '../utils/Observer';

/**
 * StateStringStoreのプロキシ。現在使っていないのでメンテされていない。
 * @deprecated
 */
const StateStringStoreProxy = function(){

    function _checkStateStringStore(){
        if(_state_string_store === null){
            throw new Error('StateStringStore not set.');
        }
    }

    this.setStateStringStore = function(state_string_store){
        if(_state_string_store !== null){
            _state_string_store.removeListener(_raiseEvent);
        }
        _state_string_store = state_string_store;
        _state_string_store.addListener(_raiseEvent);
    };

    this.getStateString = function(){
        _checkStateStringStore();
        return _state_string_store.getStateString();
    };

    this.getBaseString = function(){
        _checkStateStringStore();
        return _state_string_store.getBaseString();
    };

    this.getLayerString = function(){
        _checkStateStringStore();
        return _state_string_store.getLayerString();
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _state_string_store = null;
};
export default StateStringStoreProxy;
