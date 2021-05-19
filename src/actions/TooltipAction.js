'use strict';

import TooltipConstants from './TooltipConstants';

const TooltipAction = function(dispatcher){
    this.show = function(message){
        dispatcher.dispatch({
            action_type: TooltipConstants.SHOW,
            message: message,
        });
    };
};
export default TooltipAction;
