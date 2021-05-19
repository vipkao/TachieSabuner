'use strict';

import assert from 'assert';
import sinon from 'sinon';

import StateStringStore from '../../src/stores/StateStringStore';

describe('stores/StateStringStoreテスト', () => {
    var callback;
    var base_store;
    var layer_store;
    var list_store;

    beforeEach(() => {
        callback = {callback(){}};
        base_store = {
            getStateString(){ return 'test1'; },
            readStateString(str){},
            addListener(fn){},
        };
        layer_store = {
            getStateString(){ return 'test2'; },
            readStateString(str){},
            addListener(fn){},
        };
        list_store = {
            isSelected(){},
            getSelectedString(){ return 'test3_test4_test5'; },
            addListener(fn){},
        };
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var base_addListener = sinon.spy(base_store, 'addListener');
        var layer_addListener = sinon.spy(layer_store, 'addListener');
        var list_addListener = sinon.spy(list_store, 'addListener');

        var store = new StateStringStore(base_store, layer_store, list_store);

        assert.strictEqual(base_addListener.callCount, 1);
        assert.strictEqual(layer_addListener.callCount, 1);
        assert.strictEqual(list_addListener.callCount, 1);
    });
    it('初期状態。', () => {
        var store = new StateStringStore(base_store, layer_store, list_store);

        assert.strictEqual(store.getStateString(), 'test1_test2');
        assert.strictEqual(store.getBaseString(), 'test1');
        assert.strictEqual(store.getLayerString(), 'test2');
    });
    it('イベント：base側の更新が反映されているか。必要に応じて自身の更新イベントが発火しているか。', () => {
        var base_addListener = sinon.spy(base_store, 'addListener');
        var base_getStateString = sinon.stub(base_store, 'getStateString');

        var store = new StateStringStore(base_store, layer_store, list_store);

        var callback_emit = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);
        base_addListener.getCall(0).args[0]();

        //変更がない場合は更新イベントは発火しない。
        assert.strictEqual(callback_emit.callCount, 0);

        base_getStateString.returns('xxx');
        base_addListener.getCall(0).args[0]();

        assert.strictEqual(callback_emit.callCount, 1);
        assert.strictEqual(store.getStateString(), 'xxx_test2');
        assert.strictEqual(store.getBaseString(), 'xxx');
    });
    it('イベント：layer側の更新が反映されているか。必要に応じて自身の更新イベントが発火しているか。', () => {
        var layer_addListener = sinon.spy(layer_store, 'addListener');
        var layer_getStateString = sinon.stub(layer_store, 'getStateString');
        var callback_emit = sinon.spy(callback, 'callback');

        var store = new StateStringStore(base_store, layer_store, list_store);
        store.addListener(callback.callback);

        //変更がない場合は更新イベントは発火しない。
        layer_addListener.getCall(0).args[0]();
        assert.strictEqual(callback_emit.callCount, 0);

        layer_getStateString.returns('xxx_yyy');
        layer_addListener.getCall(0).args[0]();
        assert.strictEqual(callback_emit.callCount, 1);
        assert.strictEqual(store.getStateString(), 'test1_xxx_yyy');
        assert.strictEqual(store.getLayerString(), 'xxx_yyy');
    });

    it('イベント：list側の更新はbaseとlayerに渡される。', () => {
        var base_readStateString = sinon.spy(base_store, 'readStateString');
        var layer_readStateString = sinon.spy(layer_store, 'readStateString');
        var list_addListener = sinon.spy(list_store, 'addListener');
        var list_isSelected = sinon.stub(list_store, 'isSelected');
        var callback_emit = sinon.spy(callback, 'callback');

        var store = new StateStringStore(base_store, layer_store, list_store);
        store.addListener(callback.callback);

        //選択されていない場合は渡されない。
        list_isSelected.returns(false);
        list_addListener.getCall(0).args[0]();
        assert.strictEqual(base_readStateString.callCount, 0);
        assert.strictEqual(layer_readStateString.callCount, 0);

        list_isSelected.returns(true);
        list_addListener.getCall(0).args[0]();

        assert.strictEqual(base_readStateString.callCount, 1);
        assert.strictEqual(layer_readStateString.callCount, 1);
        assert.strictEqual(base_readStateString.getCall(0).args[0], 'test3');
        assert.strictEqual(layer_readStateString.getCall(0).args[0], 'test4_test5');

        //自身の更新イベントはここでは直接は発火しない。(baseやlayerの更新で間接的に発火する)
        assert.strictEqual(callback_emit.callCount, 0);
    });

});
