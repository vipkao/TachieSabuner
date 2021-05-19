'use strict';

import Observer from '../utils/Observer';
import ListRawConstants from '../actions/ListRawConstants';

/**
 * 選択状態文字列リストの生データを管理する。
 * 生データは改行文字でつなげられた選択状態文字列である。
 *
 * Listen：StateStringListStore
 */
const ListRawStore = function(list_store, dispatcher){

    function _onListRawEvent(payload){
        if(payload.action_type === ListRawConstants.UPDATE){
            _raw_data = payload.raw;
            _raiseEvent();
        }
    }

    function _updateList(){
        _raw_data = list_store.getRawStrings().join('\n');
        _raiseEvent();
    }

    //選択状態文字列リストの生データを取得する。
    this.getRaw = function(){
        return _raw_data;
    }

    //選択状態文字列の生データを改行で分割し配列で取得する。
    this.getRawByArray = function(){
        return _raw_data.replace(/\n\r/g, '\r').replace(/\n/g, '\r').split('\r');
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _raw_data = '';

    dispatcher.addListener(_onListRawEvent);
    list_store.addListener(_updateList);
};
export default ListRawStore;
