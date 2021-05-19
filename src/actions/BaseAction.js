'use strict';

import BaseConstants from './BaseConstants';

const BaseAction = function(dispatcher){
    this.select = function(id){
        dispatcher.dispatch({
            action_type: BaseConstants.SELECT,
            id: id,
        });
    };
};
export default BaseAction;
