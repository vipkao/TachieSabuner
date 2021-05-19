'use strict';

import ListRawConstants from './ListRawConstants';

const ListRawAction = function(dispatcher){
    this.update = function(raw){
        dispatcher.dispatch({
            action_type: ListRawConstants.UPDATE,
            raw: raw,
        });
    };
}

export default ListRawAction;
