'use strict';

import ButtonConstants from './ButtonConstants';

const ButtonAction = function(dispatcher){
    this.click = function(value){
        dispatcher.dispatch({
            action_type: ButtonConstants.CLICK,
            clicked: value,
        });
    };
    this.enter = function(value){
        dispatcher.dispatch({
            action_type: ButtonConstants.ENTER,
            entered: value,
        });
    };
    this.leave = function(){
        dispatcher.dispatch({
            action_type: ButtonConstants.LEAVE,
        });
    };
};
export default ButtonAction;
