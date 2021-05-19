'use strict';

import SingleLayerStore     from './SingleLayerStore';
import LeftRightLayerStore  from './LeftRightLayerStore';
import LayerStore           from './LayerStore';

/**
 * レイヤー絵の選択状態を管理するクラスのインスタンスを生成する。
 */
const LayerStoreFactory = function(create_targets){
    if(create_targets == null){
        create_targets = {
            SingleLayerStore: SingleLayerStore,
            LayerStore: LayerStore,
            LeftRightLayerStore: LeftRightLayerStore,
        };
    }
    this.createSingle = function(layer, dispatcher){
        return new create_targets.SingleLayerStore(new create_targets.LayerStore(layer), dispatcher);
    };
    this.createLeftRight = function(layer, dispatcher){
        return new create_targets.LeftRightLayerStore(new create_targets.LayerStore(layer), dispatcher);
    };
}
export default LayerStoreFactory;
