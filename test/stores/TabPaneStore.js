'use strict';

import assert from 'assert';
import sinon from 'sinon';

import TabPaneStore from '../../src/stores/TabPaneStore';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import TabPaneAction from '../../src/actions/TabPaneAction';

describe('stores/TabPaneStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new TabPaneAction(dispatcher);
        callback = {callback(){}};
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var dispatcher_addListener = sinon.spy(dispatcher, 'addListener');

        var store = new TabPaneStore([], dispatcher);

        assert.strictEqual(dispatcher_addListener.callCount, 1);
    });
    it('初期状態。', () => {
        var store = new TabPaneStore(
            [
                {caption:'cap1', tooltip:'tool1'},
                {caption:'cap2', tooltip:'tool2'},
            ],
            dispatcher
        );

        var result = store.getPaneInfos().map(info => info.id+info.caption+info.tooltip).join('');
        assert.strictEqual(result, '0cap1tool11cap2tool2');
        assert.strictEqual(store.getActivePaneId(), 0);
    });
    it('イベント：action側の更新が反映されているか。＆自身の更新イベントが発火しているか。', () => {
        var callback_emit = sinon.spy(callback, 'callback');

        var store = new TabPaneStore(
            [
                {caption:'cap1', tooltip:'tool1'},
                {caption:'cap2', tooltip:'tool2'},
            ],
            dispatcher
        );
        store.addListener(callback.callback);

        action.change(1);

        assert.strictEqual(store.getActivePaneId(), 1);
        assert.strictEqual(callback_emit.callCount, 1);
    });
});
