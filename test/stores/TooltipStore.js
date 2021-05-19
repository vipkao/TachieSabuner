'use strict';

import assert from 'assert';
import sinon from 'sinon';

import TooltipStore from '../../src/stores/TooltipStore';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import TooltipAction from '../../src/actions/TooltipAction';

describe('stores/TooltipStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new TooltipAction(dispatcher);
        callback = {callback(){}};
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var dispatcher_addListener = sinon.spy(dispatcher, 'addListener');

        var store = new TooltipStore(dispatcher);

        assert.strictEqual(dispatcher_addListener.callCount, 1);
    });
    it('初期状態。', () => {
        var store = new TooltipStore(dispatcher);

        assert.strictEqual(store.getMessage(), '');
    });
    it('イベント：action側の更新が反映されているか。＆自身の更新イベントが発火しているか。', () => {
        var callback_emit = sinon.spy(callback, 'callback');

        var store = new TooltipStore(dispatcher);
        store.addListener(callback.callback);

        action.show('xxx');

        assert.strictEqual(store.getMessage(), 'xxx');
        assert.strictEqual(callback_emit.callCount, 1);
    });
});
