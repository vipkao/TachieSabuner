'use strict';

import Observer from '../utils/Observer';
import StateStringListConstants from '../actions/StateStringListConstants';

/**
 * 選択状態文字列とそのコメントをリストとして管理する。
 */
const StateStringListStore = function(dispatcher){
    var _this = this;

    function _onStateStringListEvent(payload){
        if(payload.action_type === StateStringListConstants.ADD){
            _list.push(payload.comment + '@' + payload.state_string);
            _index = _list.length - 1;
            _selected = true;
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.ADD_RAW){
            _list.push(payload.raw);
            _index = _list.length - 1;
            _selected = true;
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.REMOVE){
            if(_list.length === 0){
                return;
            }
            _list.splice(_index, 1);
            if(_list.length === 0){
                _selected = false;
            }
            if(_index >= _list.length - 1){
                _index = _list.length - 1;
            }
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.UP){
            if(_index === 0){
                return;
            }
            _list.splice(_index - 1, 2, _list[_index], _list[_index - 1]);
            _index--;
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.DOWN){
            if(_index === _list.length - 1){
                return;
            }
            _list.splice(_index, 2, _list[_index + 1], _list[_index]);
            _index++;
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.SELECT){
            if(_list.length === 0){
                return;
            }
            _selected = true;
            _index = parseInt(payload.index, 10);
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.UNSELECT){
            _selected = false;
            _index = 0;
            _raiseEvent();
        }
        if(payload.action_type === StateStringListConstants.CLEAR){
            _selected = false;
            _index = 0;
            _list = [];
            _raiseEvent();
        }
    }

    function _split(list_string){
        return list_string.split('@');
    }

    //選択中のインデックスを取得する。
    this.getIndex = function(){
        if(_list.length === 0){
            throw new Error('empty list.');
        }
        if(!_selected){
            throw new Error('not selected.');
        }
        return _index;
    };

    //選択状態文字列のどれか一つが選択中であるならtrue。
    this.isSelected = function(){
        return _selected;
    }

    //選択されている選択状態文字列とコメントを取得する。
    this.getSelectedString = function(){
        if(_list.length === 0){
            throw new Error('empty list.');
        }
        if(!_selected){
            throw new Error('not selected.');
        }
        return _split(_list[_index])[1];
    };

    //選択されているコメントの部分を取得する。
    this.getSelectedComment = function(){
        if(_list.length === 0){
            throw new Error('empty list.');
        }
        if(!_selected){
            throw new Error('not selected.');
        }
        return _split(_list[_index])[0];
    };

    //選択されている選択状態文字列の部分を取得する。
    this.getStrings = function(){
        return _list.map((item)=>{ return _split(item)[1]; });
    };

    //全ての選択状態文字列とコメントの配列を取得する。
    this.getRawStrings = function(){
        return _list.map((item)=>{ return item; });
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _list = [];
    var _index = 0;
    var _selected = false;

    dispatcher.addListener(_onStateStringListEvent);

};
export default StateStringListStore;
