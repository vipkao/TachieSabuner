'use strict';

import SelectConstants from './SelectConstants';

const SelectAction = function(dispatcher){
    this.select = function(value){
        dispatcher.dispatch({
            action_type: SelectConstants.SELECT,
            selected: value,
        });
    };
    this.enter = function(){
        dispatcher.dispatch({
            action_type: SelectConstants.ENTER,
        });
    };
};
export default SelectAction;
