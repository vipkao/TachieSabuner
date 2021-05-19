'use strict';

import Observer from '../utils/Observer';
import LayerConstants from '../actions/LayerConstants';

/**
 * 一つのレイヤー絵の選択状態を管理する。
 * このクラスは、口の様に一つのパーツが一つしかないタイプを管理する。
 * 例えば目は二つあるタイプとなる。
 * レイヤー絵の設定の保持は委譲している。
 *
 * 委譲：LayerStore
 */
const SingleLayerStore = function(layer_store, layer_dispatcher){
    var _this = this;

    function _onLayerEvent(payload){
        if(payload.action_type === LayerConstants.SELECT
        && payload.layer_id === _layer_store.getId()
        ){
            _restoreState();
            if(_state === payload.parts_id){
                _state = '';
            }else{
                _state = payload.parts_id;
            }
            _raiseEvent();
        }
        if(payload.action_type === LayerConstants.START_PREVIEW
        && payload.layer_id === _layer_store.getId()
        ){
            _saveState();
            _state = payload.parts_id;
            _raiseEvent();
        }
        if(payload.action_type === LayerConstants.END_PREVIEW
        && payload.layer_id === _layer_store.getId()
        ){
            _restoreState();
            _raiseEvent();
        }
    }

    function _getDefaultState(){
        var def = _layer_store.getDefaultId();
        return (def == null ? _layer_store.getImages()[0].id : def);
    }

    function _saveState(){
        if(!_stack_state_enable){
            _stack_state = _state;
            _stack_state_enable = true;
        }
    }

    function _restoreState(){
        if(_stack_state_enable){
            _state = _stack_state;
            _stack_state_enable = false;
        }
    }

    this.getLayer = function(){ return _layer_store.getLayer(); };
    this.getLayerType = function(){ return _layer_store.getLayerType(); };
    this.getId = function(){ return _layer_store.getId(); };
    this.getInfo = function(){ return _layer_store.getInfo(); };

    //選択状態文字列を読み取り選択状態に反映させる。
    this.readStateString = function(state_string){
        _state = '';
        var states = state_string.split('_');
        var layer_id = _layer_store.getId();
        for(var image_id of _layer_store.getImageIds()){
            if(states.some(s => s === layer_id+image_id)){
                _state = image_id;
                break;
            }
        }
        _raiseEvent();
    };

    //現在の選択状態を取得する。
    this.getState = function(){
        return _state;
    };

    //現在の選択状態とその選択状態にあるレイヤー絵の設定を取得する。
    //['state']が選択状態、['info']がレイヤー絵の設定となる。
    this.getStateArray = function(){
        if(!_state){
            return [];
        }
        return [{
            state: _layer_store.getId()+_state,
            info: _layer_store.getInfo(),
        }];
    };

    //現在の選択状態文字列を取得する。
    this.getStateString = function(){
        if(_state === ''){
            return '';
        }
        return _layer_store.getId()+_state;
    };

    //listen状態など、他のオブジェクトとの接続を破棄する。
    this.dispose = function(){
        layer_dispatcher.removeListener(_onLayerEvent);
        _observer.dispose();
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _layer_store = layer_store;
    var _state = _getDefaultState();
    var _stack_state_enable = false;
    var _stack_state = '';

    layer_dispatcher.addListener(_onLayerEvent);

};
export default SingleLayerStore;
