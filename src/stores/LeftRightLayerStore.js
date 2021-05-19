'use strict';

import Observer from '../utils/Observer';
import LayerConstants from '../actions/LayerConstants';

/**
 * 一つのレイヤー絵の選択状態を管理する。
 * このクラスは、目の様に一つのパーツが左右あるタイプを管理する。
 * レイヤー絵の設定の保持は委譲している。
 *
 * 委譲：LayerStore
 */
const LeftRightLayerStore = function(layer_store, dispatcher){
    var _this = this;

    function _onLayerEvent(payload){
        if(payload.action_type === LayerConstants.SELECT
        && payload.layer_id === _layer_store.getId()
        ){
            var parts = _getPartsInfo(payload.parts_id);
            _restoreState();
            if(!_state){
                _state = {};
            }
            if(parts.pos === 'both'){
                if(_state.left === _state.right && _state.left === parts.id){
                    //左右が共に選択状態なら、左右の選択が同時に解除される。
                    _state = {};
                }else{
                    //そうでないなら、左右が同時に選択状態になる。
                    _state['left'] = parts.id;
                    _state['right'] = parts.id;
                }
            }else{
                if(_state[parts.pos] === parts.id){
                    delete _state[parts.pos];
                }else{
                    _state[parts.pos] = parts.id;
                }
            }
            _raiseEvent();
        }
        if(payload.action_type === LayerConstants.START_PREVIEW
        && payload.layer_id === _layer_store.getId()
        ){
            //プレビューは常に左右同時に行われる。
            var parts = _getPartsInfo(payload.parts_id);
            _saveState();
            _state['left'] = parts.id;
            _state['right'] = parts.id;
            _raiseEvent();
        }
        if(payload.action_type === LayerConstants.END_PREVIEW
        && payload.layer_id === _layer_store.getId()
        ){
            _restoreState();
            _raiseEvent();
        }
    }

    function _getPartsInfo(parts_payload){
        var id = parts_payload.substr(0, parts_payload.length - 1);
        var pos = parts_payload.substr(parts_payload.length - 1);
        if(pos === 'b'){
            return {id: id, pos: 'both'};
        }
        if(pos === 'l'){
            return {id: id, pos: 'left'};
        }
        if(pos === 'r'){
            return {id: id, pos: 'right'};
        }
        throw new Error('['+pos+'] is illigal pos.');
    }

    function _getDefaultState(){
        var ret = {};
        var def = _layer_store.getDefaultId();
        ret['left'] = (def == null ? _layer_store.getImages()[0].id : def);
        ret['right'] = (def == null ? _layer_store.getImages()[0].id : def);
        return ret;
    }

    function _saveState(){
        if(!_stack_state_enable){
            _stack_state = {};
            if(_state.left){
                _stack_state['left'] = _state.left;
            }
            if(_state.right){
                _stack_state['right'] = _state.right;
            }
            _stack_state_enable = true;
        }
    }

    function _restoreState(){
        if(_stack_state_enable){
            _state = {};
            if(_stack_state.left){
                _state['left'] = _stack_state.left;
            }
            if(_stack_state.right){
                _state['right'] = _stack_state.right;
            }
            _stack_state_enable = false;
        }
    }

    this.getLayer = function(){ return _layer_store.getLayer(); };
    this.getLayerType = function(){ return _layer_store.getLayerType(); };
    this.getId = function(){ return _layer_store.getId(); };
    this.getInfo = function(){ return _layer_store.getInfo(); };

    //選択状態文字列を読み取り選択状態に反映させる。
    this.readStateString = function(state_string){
        _state = {};
        var states = state_string.split('_');
        var layer_id = _layer_store.getId();
        for(var image_id of _layer_store.getImageIds()){
            if(states.some(s => s === layer_id+image_id+'l')){
                _state['left'] = image_id;
            }
            if(states.some(s => s === layer_id+image_id+'r')){
                _state['right'] = image_id;
            }
        }
        _raiseEvent();
    };

    //現在の選択状態を取得する。
    //['left']が左、['right']が右の選択状態となる。
    this.getState = function(){
        return _state;
    };

    //現在の選択状態とその選択状態にあるレイヤー絵の設定を取得する。
    //['state']が選択状態、['info']がレイヤー絵の設定となる。
    this.getStateArray = function(){
        var ret = [];
        if(_state.left){
            ret.push({
                state: _layer_store.getId()+_state.left+'l',
                info: _layer_store.getInfo(),
            });
        }
        if(_state.right){
            ret.push({
                state: _layer_store.getId()+_state.right+'r',
                info: _layer_store.getInfo(),
            });
        }
        return ret;
    };

    //現在の選択状態文字列を取得する。
    this.getStateString = function(){
        return _this.getStateArray().map(state => state.state).join('_');
    }

    //listen状態など、他のオブジェクトとの接続を破棄する。
    this.dispose = function(){
        dispatcher.removeListener(_onLayerEvent);
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

   dispatcher.addListener(_onLayerEvent);

};
export default LeftRightLayerStore;
