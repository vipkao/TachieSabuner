'use strict';

import Observer from '../utils/Observer';
import TooltipConstants from '../actions/TooltipConstants';

/**
 * ツールチップの状態を管理する。
 */
const TooltipStore = function(dispatcher){
    var _this = this;

    function _onTooltipEvent(payload){
        if(payload.action_type === TooltipConstants.SHOW){
            _message = payload.message;
            _raiseEvent();
        }
    }

    //現在のツールチップメッセージを取得する。
    this.getMessage = function(){
        return _message;
    };

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _message = '';

    dispatcher.addListener(_onTooltipEvent);
};
export default TooltipStore;
