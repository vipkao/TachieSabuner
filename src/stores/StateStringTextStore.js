'use strict';

import Observer from '../utils/Observer';
import StateStringConstants from '../actions/StateStringConstants';

/**
 * 選択状態文字列自体を管理する。
 * 
 * Listen：StateStringStore
 */
const StateStringTextStore = function(state_string_store, dispatcher){
    var _this = this;

    function _onStateStringEvent(payload){
        if(payload.action_type === StateStringConstants.EDITING_STRING){
            if(_state_string === payload.state_string){
                return;
            }
            _state_string = payload.state_string;
            _raiseEvent();
        }
        if(payload.action_type === StateStringConstants.UPDATE_STRING){
            _state_string = payload.state_string;
            state_string_store.readStateString(payload.state_string);
        }
    }

    function _updateStore(){
        var new_string = _state_string_store.getStateString();
        if(_state_string === new_string){
            return;
        }
        _state_string = new_string;
        _raiseEvent();
    }

    //選択状態文字列を取得する。
    this.getStateString = function(){
        return _state_string;
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _state_string_store = state_string_store;
    var _state_string;

    dispatcher.addListener(_onStateStringEvent);
    _state_string_store.addListener(_updateStore);

    _updateStore();
};
export default StateStringTextStore;
