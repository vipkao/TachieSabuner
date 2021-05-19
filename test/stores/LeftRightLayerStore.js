'use strict';

import assert from 'assert';
import sinon from 'sinon';

import LeftRightLayerStore from '../../src/stores/LeftRightLayerStore';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import LayerAction from '../../src/actions/LayerAction';

describe('stores/LeftRightLayerStoreテスト', () => {
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

        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store_spy.callCount, 1);
    });
    it('getLayer', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getLayer(), 'test1');
    });
    it('getLayerType', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getLayerType(), 'test6');
    });
    it('getId', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getId(), 'test7');
    });
    it('getInfo', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getInfo(), 'test2');
    });
    it('getState：デフォルト設定に従っているか。', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getState().left, 'test3');
        assert.strictEqual(store.getState().right, 'test3');
    });
    it('getState：デフォルト設定が無い場合はimagesの最初の項目になっているか。', () => {
        var layer_store_stub = sinon.stub(layer_store, 'getDefaultId');
        layer_store_stub.returns(null);

        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getState().left, 'test4');
        assert.strictEqual(store.getState().right, 'test4');
    });
    it('getStateArray', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        var str = store.getStateArray().map(state => (state.state+state.info)).join('');
        assert.strictEqual(str, 'test7test3ltest2test7test3rtest2');
    });
    it('getStateArray：選択されていない場合はstateがない。', () => {
        var layer_store_stub1 = sinon.stub(layer_store, 'getDefaultId');
        layer_store_stub1.returns(null);
        var layer_store_stub2 = sinon.stub(layer_store, 'getImages');
        layer_store_stub2.returns([{id:null}]);

        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getStateArray().length, 0);
    });
    it('getStateString', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        assert.strictEqual(store.getStateString(), 'test7test3l_test7test3r');
    });
    it('readStateString', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);

        store.readStateString('xxx_test7test5l_test7test5r_xxx');
        assert.strictEqual(store.getStateString(), 'test7test5l_test7test5r');
        store.readStateString('xxx_test7test4l_test7test5r_xxx');
        assert.strictEqual(store.getStateString(), 'test7test4l_test7test5r');
        store.readStateString('xxx_test7test5l_test7test4r_xxx');
        assert.strictEqual(store.getStateString(), 'test7test5l_test7test4r');
        store.readStateString('xxx_test7test4l_xxx');
        assert.strictEqual(store.getStateString(), 'test7test4l');
        store.readStateString('xxx');
        assert.strictEqual(store.getStateString(), '');
    });
    it('イベント：buttonにhoverした。自身の更新イベントも発火する。', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.startPreview('test7', 'xxxb');
        assert.strictEqual(store.getStateString(), 'test7xxxl_test7xxxr');
        assert.strictEqual(callback_spy.callCount, 1);
    });
    it('イベント：buttonにhover後にleaveした。自身の更新イベントも発火する。', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.startPreview('test7', 'xxxb');
        action.endPreview('test7');
        assert.strictEqual(store.getStateString(), 'test7test3l_test7test3r');
        assert.strictEqual(callback_spy.callCount, 2);
    });
    it('イベント：enter前のleaveは動作しない。自身の更新イベントは発火する。', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.endPreview('test7');
        assert.strictEqual(store.getStateString(), 'test7test3l_test7test3r');
        assert.strictEqual(callback_spy.callCount, 1);
    });
    it('イベント：ボタンをクリックした。', () => {
        var store = new LeftRightLayerStore(layer_store, dispatcher);
        var callback_spy = sinon.spy(callback, 'callback');
        store.addListener(callback.callback);

        action.select('test7', 'xxxb');
        assert.strictEqual(store.getStateString(), 'test7xxxl_test7xxxr');
        assert.strictEqual(callback_spy.callCount, 1);

        //キャンセル
        action.select('test7', 'xxxb');
        assert.strictEqual(store.getStateString(), '');
        assert.strictEqual(callback_spy.callCount, 2);

        //left
        action.select('test7', 'llll');
        assert.strictEqual(store.getStateString(), 'test7llll');
        assert.strictEqual(callback_spy.callCount, 3);

        //right
        action.select('test7', 'rrrr');
        assert.strictEqual(store.getStateString(), 'test7llll_test7rrrr');
        assert.strictEqual(callback_spy.callCount, 4);

        //rightキャンセル
        action.select('test7', 'rrrr');
        assert.strictEqual(store.getStateString(), 'test7llll');
        assert.strictEqual(callback_spy.callCount, 5);

        //leftキャンセル
        action.select('test7', 'llll');
        assert.strictEqual(store.getStateString(), '');
        assert.strictEqual(callback_spy.callCount, 6);
    });
});
