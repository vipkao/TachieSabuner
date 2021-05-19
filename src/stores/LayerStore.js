'use strict';

/**
 * 一つのレイヤー絵の設定を保持する。
 * 選択状態は管理しない。
 */
const LayerStore = function(layer_data){
    var _this = this;

    //レイヤー絵の設定を取得する。参照で取得するので扱いに注意。
    this.getLayer = function(){
        return _layer_data;
    };

    //レイヤー絵の設定を取得する。getLayerと違い、値で取得する。
    this.getInfo = function(){
        return {
            suffix: _layer_data.suffix,
            top: _layer_data.top,
            left: _layer_data.left,
            default: _layer_data.default,
        }
    };

    //レイヤー絵の設定からデフォルトで選択されるパーツIDを取得する。
    this.getDefaultId = function(){
        return _layer_data.default;
    };

    //レイヤー絵の設定から全てのパーツ絵の設定を取得する。
    this.getImages = function(){
        return _layer_data.images;
    };

    //レイヤー絵のの設定から全てのパーツ絵のIDを配列で取得する。
    this.getImageIds = function(){
        var ret = [];
        for(var image of _layer_data.images){
            ret.push(image.id);
        }
        return ret;
    }

    //レイヤー絵の設定からレイヤーの種類を取得する。
    this.getLayerType = function(){
        return _layer_data.type;
    };

    //レイヤー絵の設定からレイヤーIDを取得する。
    this.getId = function(){
        return _layer_data.id;
    }

    var _layer_data = layer_data;
}
export default LayerStore;
