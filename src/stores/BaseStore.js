'use strict';

import Observer from '../utils/Observer';

import BaseConstants      from '../actions/BaseConstants';

/**
 * ベース絵の選択状態と、ベース絵に属するレイヤー絵(差分絵)の設定を保持する。
 * ベース絵とは、重ねられるレイヤー絵の一番下にある絵。
 * 表情が差分としてレイヤー絵になっているの立ち絵でいうと、のっぺらぼうの人の絵のこと。
 */
const BaseStore = function(source_data, base_dispatcher){
    var _this = this;

    function _converter(source){
        return source;
    }

    function _stateClear(){
        _state = _this.getDefaultState();
        _alias = _getBaseById(_source_data, _state).alias;
    }

    function _onBaseEvent(payload){
        if(payload.action_type === BaseConstants.SELECT){
            if(_state === payload.id){
                return;
            }
            _stateClear();
            _state = payload.id;
            _alias = _getBaseById(_source_data, _state).alias;
            _raiseEvent();
        }
    }

    function _getBaseById(source, base_id){
        for(var base of source){
            if(base.id === base_id){
                return base;
            }
        }
        throw new Error("[" + base_id + "] not found");
    }

    //選択状態文字列を読み取り選択状態に反映させる。
    this.readStateString = function(state_string){
        _state = state_string;
        _alias = _getBaseById(_source_data, _state).alias;
        if(_state === ''){
            _stateClear();
        }
        _raiseEvent();
    }

    //デフォルト(初期状態)の選択状態を取得する。
    this.getDefaultState = function(){
        return _source_data[0].id;
    }

    //全てのベース絵の設定を取得する。
    this.getBases = function(){
        return _source_data;
    }

    //現在選択状態にあるベース絵の設定を取得する。参照で取得するので扱いに注意。
    this.getBase = function(base_id){
        return _getBaseById(_source_data, base_id);
    }

    //現在選択状態にあるベース絵の設定を取得する。getBaseと違い値で取得する。
    this.getInfo = function(base_id){
        var base = _getBaseById(_source_data, base_id);
        return {
            width: base.width,
            height: base.height,
            suffix: base.suffix,
            download: base.download,
        };
    }

    //現在選択状態にあるベース絵に属するレイヤー絵の設定を取得する。
    this.getLayers = function(){
        return _getBaseById(_source_data, _state).layers;
    }

    //現在の選択状態を取得する。
    this.getState = function(){
        return _state;
    }

    this.getAlias = function(){
        return _alias == null ? "" : _alias;
    }

    //現在の選択状態文字列を取得する。
    this.getStateString = function(){
        return _state;
    }

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _source_data = _converter(source_data);
    var _state = "";
    var _alias = "";

    base_dispatcher.addListener(_onBaseEvent);
    _stateClear();

};
export default BaseStore;
