'use strict';

import AppearanceConstants from './AppearanceConstants';

const AppearanceAction = function(dispatcher){
    this.scale = function(index){
        dispatcher.dispatch({
            action_type: AppearanceConstants.SCALE,
            index: index,
        });
    };
};
export default AppearanceAction;
