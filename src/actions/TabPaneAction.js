'use strict';

import TabPaneConstants from './TabPaneConstants';

const TabPaneAction = function(dispatcher){
    this.change = function(pane_id){
        dispatcher.dispatch({
            action_type: TabPaneConstants.CHANGE,
            pane_id: pane_id,
        });
    };
};
export default TabPaneAction;
