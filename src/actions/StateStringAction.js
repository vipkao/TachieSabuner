'use strict';

import StateStringConstants from './StateStringConstants';

const StateStringAction = function(dispatcher){
    this.updateBase = function(value){
        dispatcher.dispatch({
            action_type: StateStringConstants.UPDATE_BASE,
            state_string: value,
        });
    };
    this.updateLayer = function(value){
        dispatcher.dispatch({
            action_type: StateStringConstants.UPDATE_LAYER,
            state_string: value,
        });
    };
    this.updateString = function(value){
        dispatcher.dispatch({
            action_type: StateStringConstants.UPDATE_STRING,
            state_string: value,
        });
    };
    this.editingString = function(value){
        dispatcher.dispatch({
            action_type: StateStringConstants.EDITING_STRING,
            state_string: value,
        });
    };
};
export default StateStringAction;
