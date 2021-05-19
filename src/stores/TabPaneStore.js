'use strict';

import Observer from '../utils/Observer';
import TabPaneConstants from '../actions/TabPaneConstants';

/**
 * タブとその選択状態を管理する。
 */
const TabPaneStore = function(pane_infos, dispatcher){
    var _this = this;

    function _onTabPaneEvent(payload){
        if(payload.action_type === TabPaneConstants.CHANGE){
            _active_pane = payload.pane_id;
            _raiseEvent();
        };
    };

    //現在アクティブになっているペーンIDを取得する。
    this.getActivePaneId = function(){
        return _active_pane;
    };

    //全てのペーンの情報を取得する。
    this.getPaneInfos = function(){
        return _pane_infos;
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _active_pane = 0;
    var _pane_infos = function(){
        var i = 0;
        return pane_infos.map((info) => {
            if(typeof info === 'string'){
                return info;
            }
            return {id: i++, caption: info.caption, tooltip: info.tooltip };
        });
    }();

    dispatcher.addListener(_onTabPaneEvent);

};
export default TabPaneStore;
