'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Dispatcher from './dispatcher/Dispatcher';

import BaseStore from './stores/BaseStore';
import AppearanceStore from './stores/AppearanceStore';
import LayersStore from './stores/LayersStore';
import StateStringStore from './stores/StateStringStore';
import StateStringTextStore from './stores/StateStringTextStore';
import CommentStore from './stores/CommentStore';
import StateStringListStore from './stores/StateStringListStore';
import TabPaneStore from './stores/TabPaneStore';
import ListRawStore from './stores/ListRawStore';
import TooltipStore from './stores/TooltipStore';
import LayerStoreFactory from './stores/LayerStoreFactory';

import BaseAction from './actions/BaseAction';
import AppearanceAction from './actions/AppearanceAction';
import LayerAction from './actions/LayerAction';
import ButtonAction from './actions/ButtonAction';
import TooltipAction from './actions/TooltipAction';
import TabPaneAction from './actions/TabPaneAction';
import ListRawAction from './actions/ListRawAction';
import StateStringListAction from './actions/StateStringListAction';
import StateStringAction from './actions/StateStringAction';
import CommentAction from './actions/CommentAction';

import TabPaneFactory from './components/TabPaneFactory';
import ButtonFactory from './components/ButtonFactory';
import ListRawFactory from './components/ListRawFactory';
import StateStringFactory from './components/StateStringFactory';
import StateStringListFactory from './components/StateStringListFactory';
import LayerImageFactory from './components/LayerImageFactory';
import TooltipFactory from './components/TooltipFactory';
import DownloadButtons from './components/DownloadButtons';
import DownloadAction from './actions/DownloadAction';
import DownloadStore from './stores/DownloadStore';

import ImagePathBuilder from './utils/ImagePathBuilder/BaseFolder'


var dispatcher = new Dispatcher();

var base_store = new BaseStore(
    SETTINGS
    ,dispatcher
);
var appearance_store = new AppearanceStore(
    SCALE_LIST,
    dispatcher
);
var layer_store = new LayersStore(
    base_store
    ,dispatcher
    ,new LayerStoreFactory()
);
var download_store = new DownloadStore(
    dispatcher
);
var state_list_store = new StateStringListStore(
    dispatcher
);
var state_string_store = new StateStringStore(
    base_store
    ,layer_store
    ,state_list_store
    ,dispatcher
);
var state_string_text_store = new StateStringTextStore(
    state_string_store
    ,dispatcher
);
var comment_store = new CommentStore(
    state_list_store
    ,dispatcher
);
var tab_pane_store = new TabPaneStore(
    [
        {caption:"差分組み立て", tooltip: "差分を組み立てます。"},
        {caption:"ダウンロード", tooltip:"立ち絵をダウンロードします。"},
        {caption:"リストデータ扱い", tooltip: "差分情報のリストデータを取り扱います。"},
        'br',
        {caption:"吉里吉里マクロ", tooltip: "タグ打ち用の吉里吉里のマクロを取り扱います。"},
    ]
    , dispatcher
);
var list_raw_store = new ListRawStore(
    state_list_store
    , dispatcher
);
var tooltip_store = new TooltipStore(
    dispatcher
);
var tooltip_action = new TooltipAction(dispatcher);

var path = "images/";

ReactDOM.render(<TabPaneFactory
    caption="機能一覧："
    pane_store={tab_pane_store}
    pane_action={new TabPaneAction(dispatcher)}
    pane_components={[
        <ButtonFactory
            appearance_store={appearance_store}
            base_store={base_store}
            layer_store={layer_store}
            appearance_action={new AppearanceAction(dispatcher)}
            base_action={new BaseAction(dispatcher)}
            layer_action={new LayerAction(dispatcher)}
            tooltip_action={tooltip_action}
        />,
        <DownloadButtons
            download_action={new DownloadAction(
                path,
                new ImagePathBuilder(),
                base_store,
                layer_store,
                state_string_store,
                dispatcher
            )}
            tooltip_action={tooltip_action}
            download_store={download_store}
        />,
        <ListRawFactory
            raw_store={list_raw_store}
            raw_action={new ListRawAction(dispatcher)}
            list_action={new StateStringListAction(dispatcher)}
            tooltip_action={tooltip_action}
        />,
        <span>未実装</span>,
    ]}
    tooltip_action={tooltip_action}
/>, document.getElementById('tab_pane'));

ReactDOM.render(<StateStringFactory
    text_store={state_string_text_store}
    text_action={new StateStringAction(dispatcher)}
    state_string_action={new StateStringAction(dispatcher)}
    comment_store={comment_store}
    comment_action={new CommentAction(dispatcher)}
    tooltip_action={tooltip_action}
/>, document.getElementById('state_string'));

ReactDOM.render(<StateStringListFactory
    list_store={state_list_store}
    list_action={new StateStringListAction(dispatcher)}
    state_store={state_string_store}
    comment_store={comment_store}
    state_action={new StateStringAction(dispatcher)}
    tooltip_action={tooltip_action}
/>, document.getElementById('state_list'));

ReactDOM.render(<LayerImageFactory
    path={path}
    path_builder={new ImagePathBuilder()}
    base_store={base_store}
    layer_store={layer_store}
    appearance_store={appearance_store}
/>, document.getElementById('images'));

ReactDOM.render(<TooltipFactory
    tooltip_store={tooltip_store}
/>, document.getElementById('tooltip'));

if(DEFAULT_STATE_STRING_LIST){
    for(var raw of DEFAULT_STATE_STRING_LIST){
        new StateStringListAction(dispatcher).addRaw(raw);
    }
    new StateStringListAction(dispatcher).unselect();
    new StateStringListAction(dispatcher).select(0);
}
