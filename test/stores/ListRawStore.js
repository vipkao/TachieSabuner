'use strict';

import assert from 'assert';
import sinon from 'sinon';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import ListRawStore from '../../src/stores/ListRawStore';

import ListRawAction from '../../src/actions/ListRawAction';

describe('stores/ListRawStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;
    var list_store;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new ListRawAction(dispatcher);
        callback = {callback(){}};
        list_store = new function(){
            this.getRawStrings = function(){ return ['a', 'b']; };
            this.addListener = function(){};
        }();
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var dispatcher_spy = sinon.spy(dispatcher, 'addListener');
        var store_spy = sinon.spy(list_store, 'addListener');

        var store = new ListRawStore(list_store, dispatcher);

        assert.strictEqual(dispatcher_spy.callCount, 1);
        assert.strictEqual(store_spy.callCount, 1);
    });
    it('getRaw：初期値。', () => {
        var store = new ListRawStore(list_store, dispatcher);

        assert.strictEqual(store.getRaw(), '');
    });
    it('getRaw：dispatcher側で更新された値が反映されている。', () => {
        var store = new ListRawStore(list_store, dispatcher);

        action.update('test');

        assert.strictEqual(store.getRaw(), 'test');
    });
    it('getRaw：store側で更新された値が反映されている。', () => {
        var list_store_spy = sinon.spy(list_store, 'addListener');

        var store = new ListRawStore(list_store, dispatcher);

        list_store_spy.getCall(0).args[0]();

        assert.strictEqual(store.getRaw(), 'a\nb');
    });
    it('getRawByArray', () => {
        var store = new ListRawStore(list_store, dispatcher);

        action.update('test1\n\rtest2');

        assert.strictEqual(store.getRawByArray().length, 2);
        assert.strictEqual(store.getRawByArray().join(''), 'test1test2');
    });
    it('イベント：dispatcher側で更新イベントが発火する。', () => {
        var store = new ListRawStore(list_store, dispatcher);

        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);
        action.update('test');

        assert.strictEqual(callback_spy.callCount, 1);
    });
    it('イベント：store側で更新イベントが発火する。', () => {
        var list_store_spy = sinon.spy(list_store, 'addListener');

        var store = new ListRawStore(list_store, dispatcher);

        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);
        list_store_spy.getCall(0).args[0]();

        assert.strictEqual(callback_spy.callCount, 1);
    });
});
