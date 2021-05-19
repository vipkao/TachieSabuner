'use strict';

import assert from 'assert';
import sinon from 'sinon';

import StateStringTextStore from '../../src/stores/StateStringTextStore';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import StateStringAction from '../../src/actions/StateStringAction';

describe('stores/StateStringTextStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;
    var state_string_store;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new StateStringAction(dispatcher);
        callback = {callback(){}};
        state_string_store = {
            getStateString(){ return 'test1'; },
            readStateString(){},
            addListener(fn){},
        };
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var dispatcher_addListener = sinon.spy(dispatcher, 'addListener');
        var state_addListener = sinon.spy(state_string_store, 'addListener');

        var store = new StateStringTextStore(state_string_store, dispatcher);

        assert.strictEqual(dispatcher_addListener.callCount, 1);
        assert.strictEqual(state_addListener.callCount, 1);
    });
    it('コンストラクタ：state_stringを読みに行っているか。', () => {
        var state_getStateString = sinon.spy(state_string_store, 'getStateString');

        var store = new StateStringTextStore(state_string_store, dispatcher);

        assert.strictEqual(state_getStateString.callCount, 1);
    });
    it('初期状態。', () => {
        var store = new StateStringTextStore(state_string_store, dispatcher);

        assert.strictEqual(store.getStateString(), 'test1');
    });
    it('イベント：action側の更新が反映されているか。＆自身の更新イベントが発火しているか。', () => {
        var callback_emit = sinon.spy(callback, 'callback');
        var state_readStateString = sinon.spy(state_string_store, 'readStateString');

        var store = new StateStringTextStore(state_string_store, dispatcher);
        store.addListener(callback.callback);

        action.editingString('test2');

        assert.strictEqual(store.getStateString(), 'test2');
        assert.strictEqual(callback_emit.callCount, 1);
        assert.strictEqual(state_readStateString.callCount, 0);

        action.updateString('test3');

        assert.strictEqual(store.getStateString(), 'test3');
        assert.strictEqual(callback_emit.callCount, 1);
        assert.strictEqual(state_readStateString.callCount, 1);
    });

    it('イベント：store側の更新が反映されているか。＆自身の更新イベントが発火しているか。', () => {
        var callback_emit = sinon.spy(callback, 'callback');
        var state_addListener = sinon.spy(state_string_store, 'addListener');
        var state_getStateString = sinon.stub(state_string_store, 'getStateString');

        var store = new StateStringTextStore(state_string_store, dispatcher);
        store.addListener(callback.callback);

        state_getStateString.returns('xxx');
        state_addListener.getCall(0).args[0]();

        assert.strictEqual(store.getStateString(), 'xxx');
        assert.strictEqual(callback_emit.callCount, 1);
    });

});
