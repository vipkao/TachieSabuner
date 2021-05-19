'use strict';

import assert from 'assert';
import sinon from 'sinon';

import SingleLayerStore from '../../src/stores/SingleLayerStore';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import LayerAction from '../../src/actions/LayerAction';

describe('stores/SingleLayerStoreテスト', () => {
    var dispatcher;
    var action;
    var callback;
    var layer_store;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        action = new LayerAction(dispatcher);
        callback = {callback(){}};
        layer_store = new function(){
            this.getLayer       = function(){ return 'test1'; };
            this.getInfo        = function(){ return 'test2'; };
            this.getDefaultId   = function(){ return 'test3'; };
            this.getImages      = function(){ return [{id:'test4'}]; };
            this.getImageIds    = function(){ return ['test5', 'test4']; };
            this.getLayerType   = function(){ return 'test6'; };
            this.getId          = function(){ return 'test7'; };
        }();
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var store_spy = sinon.spy(dispatcher, 'addListener');

        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store_spy.callCount, 1);
    });
    it('getLayer', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getLayer(), 'test1');
    });
    it('getLayerType', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getLayerType(), 'test6');
    });
    it('getId', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getId(), 'test7');
    });
    it('getInfo', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getInfo(), 'test2');
    });
    it('getState：デフォルト設定に従っているか。', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getState(), 'test3');
    });
    it('getState：デフォルト設定が無い場合はimagesの最初の項目になっているか。', () => {
        var layer_store_stub = sinon.stub(layer_store, 'getDefaultId');
        layer_store_stub.returns(null);

        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getState(), 'test4');
    });
    it('getStateArray', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        var str = store.getStateArray().map(state => (state.state+state.info)).join('');
        assert.strictEqual(str, 'test7test3test2');
    });
    it('getStateArray：選択されていない場合はstateがない。', () => {
        var layer_store_stub1 = sinon.stub(layer_store, 'getDefaultId');
        layer_store_stub1.returns(null);
        var layer_store_stub2 = sinon.stub(layer_store, 'getImages');
        layer_store_stub2.returns([{id:null}]);

        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getStateArray().length, 0);
    });
    it('getStateString', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getStateString(), 'test7test3');
    });
    it('readStateString', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);

        store.readStateString('xxx_test7test5_xxx');
        assert.strictEqual(store.getStateString(), 'test7test5');
        store.readStateString('xxx_test7test4_xxx');
        assert.strictEqual(store.getStateString(), 'test7test4');
        store.readStateString('xxx');
        assert.strictEqual(store.getStateString(), '');
    });
    it('イベント：buttonにhoverした。自身の更新イベントも発火する。', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.startPreview('test7', 'xxx');
        assert.strictEqual(store.getStateString(), 'test7xxx');
        assert.strictEqual(callback_spy.callCount, 1);
    });
    it('イベント：buttonにhover後にleaveした。自身の更新イベントも発火する。', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.startPreview('test7', 'xxx');
        action.endPreview('test7');
        assert.strictEqual(store.getStateString(), 'test7test3');
        assert.strictEqual(callback_spy.callCount, 2);
    });
    it('イベント：enter前のleaveは動作しない。自身の更新イベントは発火する。', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.endPreview('test7');
        assert.strictEqual(store.getStateString(), 'test7test3');
        assert.strictEqual(callback_spy.callCount, 1);
    });
    it('イベント：ボタンをクリックした。', () => {
        var store = new SingleLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.select('test7', 'xxx');
        assert.strictEqual(store.getStateString(), 'test7xxx');
        assert.strictEqual(callback_spy.callCount, 1);

        //キャンセル
        action.select('test7', 'xxx');
        assert.strictEqual(store.getStateString(), '');
        assert.strictEqual(callback_spy.callCount, 2);
    });
});
