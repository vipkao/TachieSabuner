'use strict';

import assert from 'assert';
import sinon from 'sinon';

import CommentStore from '../../src/stores/CommentStore';
import Dispatcher from '../../src/dispatcher/Dispatcher';

import CommentAction from '../../src/actions/CommentAction';

describe('stores/CommentStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;
    var list_store;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new CommentAction(dispatcher);
        callback = {callback(){}};
        list_store = new function(){
            var _c;
            this.isSelected = function(){ return true; }
            this.getSelectedComment = function(){ return ''; }
            this.addListener = function(c){_c = c;}
            this.emit = function(){_c();}
        }();
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var dispatcher_mock = sinon.mock(dispatcher);
        dispatcher_mock.expects('addListener').once();
        var store_mock = sinon.mock(list_store);
        store_mock.expects('addListener').once();

        var store = new CommentStore(list_store, dispatcher);

        assert.strictEqual(dispatcher_mock.verify(), true);
        assert.strictEqual(store_mock.verify(), true);
    });
    it('イベント：アクションに反応して状態が変化しているか。', () => {
        var store = new CommentStore(list_store, dispatcher);
        action.change('test');
        assert.strictEqual(store.getComment(), 'test');
    });
    it('イベント：自身のアップデートイベントが発火しているか。', () => {
        var callback_mock = sinon.mock(callback);
        callback_mock.expects('callback').exactly(1);

        var store = new CommentStore(list_store, dispatcher);

        store.addListener(callback.callback);
        action.change('test');
        assert.strictEqual(callback_mock.verify(), true);
    });
    it('イベント：リストが非選択の場合はイベントが発火しない。', () => {
        var callback_mock = sinon.mock(callback);
        callback_mock.expects('callback').exactly(0);
        var store_stub = sinon.stub(list_store, 'isSelected');
        store_stub.returns(false);

        var store = new CommentStore(list_store, dispatcher);
        store.addListener(callback.callback);

        list_store.emit();
        assert.strictEqual(callback_mock.verify(), true);
    });
});
