'use strict';

import assert from 'assert';
import sinon from 'sinon';

import StateStringListStore from '../../src/stores/StateStringListStore';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import StateStringListAction from '../../src/actions/StateStringListAction';

describe('stores/StateStringListStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new StateStringListAction(dispatcher);
        callback = {callback(){}};
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var dispatcher_spy = sinon.spy(dispatcher, 'addListener');

        var store = new StateStringListStore(dispatcher);

        assert.strictEqual(dispatcher_spy.callCount, 1);
    });
    it('初期状態', () => {
        var store = new StateStringListStore(dispatcher);

        assert.throws(function(){store.getIndex();});
        assert.strictEqual(store.isSelected(), false);
        assert.throws(function(){store.getSelectedString();});
        assert.throws(function(){store.getSelectedComment();});
        assert.strictEqual(store.getStrings().length, 0);
        assert.strictEqual(store.getRawStrings().length, 0);
    });


    it('actionでの操作が反映されているか。更新イベントも発火しているか。', () => {
        var store = new StateStringListStore(dispatcher);

        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.add('test1', 'test2');
        assert.strictEqual(store.getIndex(), 0);
        assert.strictEqual(store.isSelected(), true);
        assert.strictEqual(store.getSelectedString(), 'test2');
        assert.strictEqual(store.getSelectedComment(), 'test1');
        assert.strictEqual(store.getStrings().join(''), 'test2');
        assert.strictEqual(store.getRawStrings().join(''), 'test1@test2');
        assert.strictEqual(callback_spy.callCount, 1);

        //追加したデータが選択される。
        action.add('test3', 'test4');
        assert.strictEqual(store.getIndex(), 1);
        assert.strictEqual(store.isSelected(), true);
        assert.strictEqual(store.getSelectedString(), 'test4');
        assert.strictEqual(store.getSelectedComment(), 'test3');
        assert.strictEqual(store.getStrings().join(''), 'test2test4');
        assert.strictEqual(store.getRawStrings().join(''), 'test1@test2test3@test4');
        assert.strictEqual(callback_spy.callCount, 2);

        action.select(0);
        assert.strictEqual(store.getIndex(), 0);
        assert.strictEqual(callback_spy.callCount, 3);

        action.down();
        assert.strictEqual(store.getIndex(), 1);
        assert.strictEqual(store.getStrings().join(''), 'test4test2');
        assert.strictEqual(store.getRawStrings().join(''), 'test3@test4test1@test2');
        assert.strictEqual(callback_spy.callCount, 4);

        //一番下でdown。イベント発火無し。
        action.down();
        assert.strictEqual(store.getIndex(), 1);
        assert.strictEqual(store.getStrings().join(''), 'test4test2');
        assert.strictEqual(store.getRawStrings().join(''), 'test3@test4test1@test2');
        assert.strictEqual(callback_spy.callCount, 4);

        action.up();
        assert.strictEqual(store.getIndex(), 0);
        assert.strictEqual(store.getStrings().join(''), 'test2test4');
        assert.strictEqual(store.getRawStrings().join(''), 'test1@test2test3@test4');
        assert.strictEqual(callback_spy.callCount, 5);

        //一番上でup。イベント発火無し。
        action.up();
        assert.strictEqual(store.getIndex(), 0);
        assert.strictEqual(store.getStrings().join(''), 'test2test4');
        assert.strictEqual(store.getRawStrings().join(''), 'test1@test2test3@test4');
        assert.strictEqual(callback_spy.callCount, 5);

        action.unselect();
        assert.throws(function(){store.getIndex();});
        assert.strictEqual(store.isSelected(), false);
        assert.throws(function(){store.getSelectedString();});
        assert.throws(function(){store.getSelectedComment();});
        assert.strictEqual(store.getStrings().join(''), 'test2test4');
        assert.strictEqual(store.getRawStrings().join(''), 'test1@test2test3@test4');
        assert.strictEqual(callback_spy.callCount, 6);

        action.select(1);
        assert.strictEqual(store.getIndex(), 1);
        assert.strictEqual(callback_spy.callCount, 7);

        action.remove();
        assert.strictEqual(store.getIndex(), 0);
        assert.strictEqual(store.isSelected(), true);
        assert.strictEqual(store.getSelectedString(), 'test2');
        assert.strictEqual(store.getSelectedComment(), 'test1');
        assert.strictEqual(store.getStrings().join(''), 'test2');
        assert.strictEqual(store.getRawStrings().join(''), 'test1@test2');
        assert.strictEqual(callback_spy.callCount, 8);

        action.clear();
        assert.throws(function(){store.getIndex();});
        assert.strictEqual(store.isSelected(), false);
        assert.throws(function(){store.getSelectedString();});
        assert.throws(function(){store.getSelectedComment();});
        assert.strictEqual(store.getStrings().length, 0);
        assert.strictEqual(store.getRawStrings().length, 0);
        assert.strictEqual(callback_spy.callCount, 9);

        //何もない状態でremove。イベント発火無し。
        action.remove();
        assert.strictEqual(callback_spy.callCount, 9);

        action.addRaw('asdf@qwer');
        assert.strictEqual(store.getIndex(), 0);
        assert.strictEqual(store.isSelected(), true);
        assert.strictEqual(store.getSelectedString(), 'qwer');
        assert.strictEqual(store.getSelectedComment(), 'asdf');
        assert.strictEqual(store.getStrings().join(''), 'qwer');
        assert.strictEqual(store.getRawStrings().join(''), 'asdf@qwer');
        assert.strictEqual(callback_spy.callCount, 10);
    });
});
