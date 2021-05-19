'use strict';

import LayerConstants from './LayerConstants';

const LayerAction = function(dispatcher){
    this.select = function(layer_id, parts_id){
        dispatcher.dispatch({
            action_type: LayerConstants.SELECT,
            layer_id: layer_id,
            parts_id: parts_id,
        });
    };
    this.startPreview = function(layer_id, parts_id){
        dispatcher.dispatch({
            action_type: LayerConstants.START_PREVIEW,
            layer_id: layer_id,
            parts_id: parts_id,
        });
    };
    this.endPreview = function(layer_id){
        dispatcher.dispatch({
            action_type: LayerConstants.END_PREVIEW,
            layer_id: layer_id,
        });
    };
};
export default LayerAction;
