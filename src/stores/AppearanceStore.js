'use strict';

import Observer from '../utils/Observer';

import AppearanceConstants      from '../actions/AppearanceConstants';

/**
 * 立ち絵の見え方に関する状態を保持する。
 */
const AppearanceStore = function(scale_source, dispatcher){
    var _this = this;

    function _initialize(){
        _scale_list_index = _scale_source.default_index;
    }

    function _onAppearanceEvent(payload){
        if(payload.action_type === AppearanceConstants.SCALE){
            _scale_list_index = payload.index;
            _raiseEvent();
        }
    }

    //立ち絵の表示サイズを取得する。
    this.getScale = function(){
        return _scale_source.list[_scale_list_index].ratio;
    }

    //表示サイズのリストを取得する。
    this.getScaleList = function(){
        return _scale_source.list.map(item => {
            return item.caption;
        });
    }

    //表示サイズのリストで、現在表示しているindexを取得する。
    this.getScaleIndex = function(){
        return _scale_list_index;
    }



    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _scale_source = scale_source;
    var _scale_list_index = "";

    dispatcher.addListener(_onAppearanceEvent);
    _initialize();

};
export default AppearanceStore;
