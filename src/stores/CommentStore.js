'use strict';

import Observer from '../utils/Observer';
import CommentConstants from '../actions/CommentConstants';


/**
 * コメントを管理する。
 * コメントは選択状態文字列に付与され、選択状態文字列の内容の認識しやすくするもの。
 * 
 * Listen：StateStringListStore
 */
const CommentStore = function(list_store, dispatcher){
    var _this = this;

    function _changeComment(payload){
        if(payload.action_type === CommentConstants.CHANGE){
            _comment = payload.comment;
            _raiseEvent();
        }
    }

    function _listStoreUpdate(){
        if(!_list_store.isSelected()){
            return;
        }
        _comment = _list_store.getSelectedComment();
        _raiseEvent();
    }

    //コメントを取得する。
    this.getComment = function(){
        return _comment;
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _list_store = list_store;

    var _comment = '';

    _list_store.addListener(_listStoreUpdate);
    dispatcher.addListener(_changeComment);
};
export default CommentStore;
