'use strict';

import assert from 'assert';
import sinon from 'sinon';

import BaseStore from '../../src/stores/BaseStore';
import Dispatcher from '../../src/dispatcher/Dispatcher';

import BaseAction from '../../src/actions/BaseAction';

describe('stores/BaseStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new BaseAction(dispatcher);
        callback = {callback(){}};
    });
    it('コンストラクタ：ディスパッチャにリスナを登録しているか。', () => {
        var dispatcher_mock = sinon.mock(dispatcher);
        dispatcher_mock.expects('addListener').once();
        var store = new BaseStore([{id:'a'}], dispatcher);
        assert.strictEqual(dispatcher_mock.verify(), true);
    });
    it('コンストラクタ：デフォルトで1つ目が選ばれているか。', () => {
        var store = new BaseStore([{id:'a'}, {id:'b'}], dispatcher);
        assert.strictEqual(store.getState(), 'a');
        assert.strictEqual(store.getStateString(), 'a');
    });
    it('getDefaultState：デフォルトは1つ目になっているか。', () => {
        var store = new BaseStore([{id:'a'}, {id:'b'}], dispatcher);
        assert.strictEqual(store.getDefaultState(), 'a');
    });
    it('getBases：全ての設定を取得できているか。', () => {
        var store = new BaseStore([{id:'a'}, {id:'b'}], dispatcher);
        assert.strictEqual(store.getBases()[0].id, 'a');
        assert.strictEqual(store.getBases()[1].id, 'b');
    });
    it('getBase：指定したIDの設定を取得できているか。', () => {
        var store = new BaseStore([{id:'a'}, {id:'b'}], dispatcher);
        assert.strictEqual(store.getBase('b').id, 'b');
    });
    it('getInfo：指定したIDの設定を取得できているか。', () => {
        var store = new BaseStore([{id:'a', suffix:'aa'}, {id:'b', suffix:'bb'}], dispatcher);
        assert.strictEqual(store.getInfo('b').suffix, 'bb');
    });
    it('getLayers：現在のレイヤー設定を取得できているか。', () => {
        var store = new BaseStore([{id:'a', layers:'a'}, {id:'b', layers:'b'}], dispatcher);
        assert.strictEqual(store.getLayers(), 'a');
    });
    it('readStateString：指定した状態文字列が反映されているか。', () => {
        var store = new BaseStore([{id:'a', layers:'a'}, {id:'b', layers:'b'}], dispatcher);
        store.readStateString('b');
        assert.strictEqual(store.getState(), 'b');
        assert.strictEqual(store.getStateString(), 'b');
    });
    it('イベント：clickイベントに反応して状態が変化しているか。', () => {
        var store = new BaseStore([{id:'a'}, {id:'b'}], dispatcher);
        action.select('b');
        assert.strictEqual(store.getState(), 'b');
    });
    it('イベント：自身のアップデートイベントが発火しているか。', () => {
        var mock = sinon.mock(callback);
        mock.expects('callback').exactly(2);
        var store = new BaseStore([{id:'a'}, {id:'b'}], dispatcher);
        store.addListener(callback.callback);
        action.select('b');
        store.readStateString('a');
        assert.strictEqual(mock.verify(), true);
    });
});
