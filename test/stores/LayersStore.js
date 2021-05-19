'use strict';

import assert from 'assert';
import sinon from 'sinon';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import LayersStore from '../../src/stores/LayersStore';

describe('stores/LayersStoreテスト', () => {
    var dispatcher;
    var callback;
    var base_store;
    var layer_store_factory;
    var single_layer_store;
    var left_right_layer_store;

    beforeEach(() => {
        dispatcher = new Dispatcher();
        callback = {callback(){}};
        
        base_store = new function(){
            var _c;
            this.getLayers          = function(){ return [
                { type:"single", test:"a", },
                { type:"left-right", test:"b", },
            ]; };
            this.addListener        = function(callback){_c = callback;}
            this.removeListener     = function(callback){};
            this.emit = function(){_c();}
        }();
        var layer_store = function(t){
            var _c;
            var _this = this;
            this.getLayer           = function(){ return _this; };
            this.getLayerType       = function(){ return t+'2'; };
            this.getId              = function(){ return t+'3'; };
            this.getInfo            = function(){ return t+'4'; };
            this.readStateString    = function(state_string){};
            this.getState           = function(){ return t+'6'; };
            this.getStateArray      = function(){ return [{state:t+'7'}]; };
            this.getStateString     = function(){ return t+'8'; };
            this.addListener        = function(callback){_c = callback;}
            this.removeListener     = function(callback){};
            this.emit = function(){_c();}
        };
        layer_store_factory = new function(){
            this.createSingle = function(layer, dispatcher){ return new layer_store(layer.test+'single'); };
            this.createLeftRight = function(layer, dispatcher){ return new layer_store(layer.test+'leftright'); };
        }();
    });
    it('コンストラクタ：リスナを登録しているか。', () => {
        var store_mock = sinon.mock(base_store);
        store_mock.expects('addListener').once();

        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store_mock.verify(), true);
    });
    it('getLayerIds：委譲されているか。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store.getLayerIds().join(''), 'asingle3bleftright3');
    });
    it('readStateString：委譲されているか。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        var callee_spy = sinon.spy(store.getLayer('asingle3'), 'readStateString');
        store.readStateString('aaaa');

        assert.strictEqual(callee_spy.callCount, 1);
        assert.strictEqual(callee_spy.getCall(0).args[0], 'aaaa');
    });
    it('getLayers：BaseStoreのレイヤー情報を持ってくる。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store.getLayers()[0].test, 'a');
        assert.strictEqual(store.getLayers()[1].test, 'b');
    });
    it('getLayer：委譲されているか。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store.getLayer('asingle3').getId(), 'asingle3');
    });
    it('getState：委譲されているか。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store.getState()['asingle3'], 'asingle6');
    });
    it('getStateArray：委譲されているか。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store.getStateArray().map(state => state.state).join(''), 'asingle7bleftright7');
    });
    it('getStateString：アンダーバーで結合されているか。', () => {
        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        assert.strictEqual(store.getStateString(), 'asingle7_bleftright7');
    });
    it('イベント：自身のアップデートイベントが発火しているか。', () => {
        var callback_mock = sinon.mock(callback);
        callback_mock.expects('callback').exactly(1);

        var store = new LayersStore(base_store, dispatcher, layer_store_factory);

        store.addListener(callback.callback);
        store.getLayer('asingle3').emit();
        assert.strictEqual(callback_mock.verify(), true);
    });
});
