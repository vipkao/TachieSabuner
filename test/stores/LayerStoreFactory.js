'use strict';

import assert from 'assert';
import sinon from 'sinon';

import LayerStoreFactory from '../../src/stores/LayerStoreFactory';

describe('stores/LayerStoreFactoryテスト', () => {
    var create_targets;
    beforeEach(() => {
        create_targets = {
            SingleLayerStore: function(){},
            LayerStore: function(){this.str = 'layer';},
            LeftRightLayerStore: function(){},
        };
    });

    it('createSingle', () => {
        var single_spy = sinon.spy(create_targets, 'SingleLayerStore');
        var layer_spy = sinon.spy(create_targets, 'LayerStore');

        var store = new LayerStoreFactory(create_targets);
        store.createSingle('test1', 'test2');

        assert.strictEqual(single_spy.calledWithNew(), true);
        assert.strictEqual(layer_spy.calledWithNew(), true);
        assert.strictEqual(single_spy.getCall(0).args[0].str, 'layer');
        assert.strictEqual(single_spy.getCall(0).args[1], 'test2');
        assert.strictEqual(layer_spy.getCall(0).args[0], 'test1');
    });
    it('createLeftRight', () => {
        var lr_spy = sinon.spy(create_targets, 'LeftRightLayerStore');
        var layer_spy = sinon.spy(create_targets, 'LayerStore');

        var store = new LayerStoreFactory(create_targets);
        store.createLeftRight('test1', 'test2');

        assert.strictEqual(lr_spy.calledWithNew(), true);
        assert.strictEqual(layer_spy.calledWithNew(), true);
        assert.strictEqual(lr_spy.getCall(0).args[0].str, 'layer');
        assert.strictEqual(lr_spy.getCall(0).args[1], 'test2');
        assert.strictEqual(layer_spy.getCall(0).args[0], 'test1');
    });
});
