'use strict';

import Observer from '../utils/Observer';
import StateStringConstants from '../actions/StateStringConstants';

/**
 * 選択状態文字列の構築を管理している。
 * それぞれの選択状態の管理は委譲している。
 * 
 * Listen：BaseStore, LayersStore, StateStringListStore
 */
const StateStringStore = function(base_store, layer_store, list_store){
    var _this = this;

    function _updateBaseStore(){
        //このクラスはBaseStoreの変更を行うので、
        //BaseStoreの更新イベントでループにならないようにしている。
        if(_prev_base_string === _base_store.getStateString()){
            return;
        }
        _prev_base_string = _base_store.getStateString();
        _raiseEvent();
    }
    function _updateLayerStore(){
        //このクラスはLayersStoreの変更を行うので、
        //LayersStoreの更新イベントでループにならないようにしている。
        if(_prev_layer_string === _layer_store.getStateString()){
            return;
        }
        _prev_layer_string = _layer_store.getStateString();
        _raiseEvent();
    }

    function _updateListStore(){
        if(!_list_store.isSelected()){
            return;
        }
        _this.readStateString(_list_store.getSelectedString());
    }

    function _parseStateString(state_string){
        //クロスサイトスクリプティングに対応するために、使用文字種を制限。
        var strings = state_string.match(/(^[a-zA-Z0-9]+?)_([_a-zA-Z0-9]*$)/);
        if(strings === null){
            return {base: '', layer: ''};
        }
        return {base: strings[1], layer: strings[2]};
    }

    //選択状態文字列を読み取り選択状態に反映させる。
    this.readStateString = function(state_string){
        if(_this.getStateString() === state_string){
            return;
        }
        var strings = _parseStateString(state_string);
        _base_store.readStateString(strings.base);
        _layer_store.readStateString(strings.layer);
    };

    //現在の選択状態文字列を取得する。
    this.getStateString = function(){
        return _base_store.getStateString()+'_'+_layer_store.getStateString();
    };

    //現在の選択状態文字列の内、ベース絵部分を取得する。
    this.getBaseString = function(){
        return _base_store.getStateString();
    };

    //現在の選択状態文字列の内、レイヤー絵部分を取得する。
    this.getLayerString = function(){
        return _layer_store.getStateString();
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _base_store = base_store;
    var _layer_store = layer_store;
    var _list_store = list_store;
    var _prev_base_string = _base_store.getStateString();
    var _prev_layer_string = _layer_store.getStateString();

    _base_store.addListener(_updateBaseStore);
    _layer_store.addListener(_updateLayerStore);
    _list_store.addListener(_updateListStore);

};
export default StateStringStore;
