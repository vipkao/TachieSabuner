'use strict';

import Observer from '../utils/Observer';

/**
 * 各レイヤー絵を管理をする。
 * 選択状態や設定の管理は委譲している。
 * レイヤー絵とは、一つのカテゴリでまとめられ、互いに排他的に表示される複数の絵のこと。
 * 表情差分の立ち絵でいうと、例えば目のパーツのセットや、口のパーツのセットがそれぞれ一つのレイヤー絵となる。
 * 
 * Listen：BaseStore
 */
const LayersStore = function(base_store, dispatcher, layer_factory){
    var _this = this;

    function _baseUpdate(){
        _disposeLayers(_layers);
        _layers = _buildLayers(_base_store.getLayers());
        _raiseEvent();
    }

    function _layerUpdate(){
        _raiseEvent();
    }

    function _disposeLayers(layers){
        for(var layer of layers){
            layer.store.removeListener(_layerUpdate);
            layer.store.dispose();
        }
    }

    function _buildLayers(layers){
        var ret = [];
        for(var layer of layers){
            var store = null;
            if(layer.type === 'single'){
                store = _layer_factory.createSingle(layer, _dispatcher);
            }
            if(layer.type === 'left-right'){
                store = _layer_factory.createLeftRight(layer, _dispatcher);
            }
            if(store === null){
                continue;
            }
            store.addListener(_layerUpdate);
            ret.push({store: store, });
        }
        return ret;
    }

    function _getLayerById(layers, layer_id){
        for(var layer of layers){
            if(layer.store.getId() === layer_id){
                return layer;
            }
        }
        throw new Error("[" + layer_id + "] not found");
    }

    //選択状態文字列を読み取り、全レイヤー絵の選択状態に反映させる。
    this.readStateString = function(state_string){
        for(var layer of _layers){
            layer.store.readStateString(state_string);
        }
    }

    //管理している全レイヤー絵のレイヤーIDを取得する。
    this.getLayerIds = function(){
        var ret = [];
        for(var layer of _layers){
            ret.push(layer.store.getId());
        }
        return ret;
    };

    //管理している全レイヤー絵の設定を取得する。
    this.getLayers = function(){
        return _base_store.getLayers();
    };

    //選択状態にあるレイヤー絵の設定を取得する。
    this.getLayer = function(layer_id){
        return _getLayerById(_layers, layer_id).store.getLayer();
    }

    //現在の選択状態をレイヤーIDをキーとした連想配列で取得する。
    this.getState = function(){
        var ret = {};
        for(var layer of _layers){
            ret[layer.store.getId()] = layer.store.getState();
        }
        return ret;
    };

    //現在の選択状態を配列で取得する。
    this.getStateArray = function(){
        var ret = [];
        for(var layer of _layers){
            ret = ret.concat(layer.store.getStateArray());
        }
        return ret;
    };

    //現在の選択状態文字列を取得する。
    this.getStateString = function(){
        return _this.getStateArray().map((state)=>{ return state.state; }).join('_');
    }

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _base_store = base_store;
    var _dispatcher = dispatcher;
    var _layer_factory = layer_factory;
    var _layers = _buildLayers(_base_store.getLayers());

    _base_store.addListener(_baseUpdate);
}
export default LayersStore;
