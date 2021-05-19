'use strict';

import StateStringListConstants from './StateStringListConstants';

const StateStringListAction = function(dispatcher){
    this.add = function(comment, state_string){
        dispatcher.dispatch({
            action_type: StateStringListConstants.ADD,
            comment: comment,
            state_string: state_string,
        });
    };
    this.addRaw = function(raw_string){
        dispatcher.dispatch({
            action_type: StateStringListConstants.ADD_RAW,
            raw: raw_string,
        });
    };
    this.remove = function(){
        dispatcher.dispatch({
            action_type: StateStringListConstants.REMOVE,
        });
    };
    this.up = function(){
        dispatcher.dispatch({
            action_type: StateStringListConstants.UP,
        });
    };
    this.down = function(){
        dispatcher.dispatch({
            action_type: StateStringListConstants.DOWN,
        });
    };
    this.select = function(index){
        dispatcher.dispatch({
            action_type: StateStringListConstants.SELECT,
            index: index,
        });
    };
    this.unselect = function(){
        dispatcher.dispatch({
            action_type: StateStringListConstants.UNSELECT,
        });
    };
    this.clear = function(){
        dispatcher.dispatch({
            action_type: StateStringListConstants.CLEAR,
        });
    };
};
export default StateStringListAction;
