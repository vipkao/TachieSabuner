'use strict';

import assert from 'assert';
import sinon from 'sinon';

import LayerStore from '../../src/stores/LayerStore';

describe('stores/LayerStoreテスト', () => {
    var layer_data;
    beforeEach(() => {
        layer_data = {
            id:'A',
            suffix:'png',
            top:100,
            left:200,
            default:'def',
            type:'tp',
            images:[
                {id:'a',},{id:'b',},{id:'c',},
            ]
        };
    });

    it('getLayer：生データそのまま返す。', () => {
        var store = new LayerStore(layer_data);
        var data = store.getLayer();

        assert.strictEqual(data, layer_data);
        assert.strictEqual(store.getLayer().suffix, 'png');
    });
    it('getLayer：生データそのままなので変更できてしまう。', () => {
        var store = new LayerStore(layer_data);
        var data = store.getLayer();

        assert.strictEqual(data, layer_data);
        data.suffix = 'jpg';
        assert.strictEqual(store.getLayer().suffix, 'jpg');
    });
    it('getInfo', () => {
        var store = new LayerStore(layer_data);
        var data = store.getLayer();
        var info = store.getInfo();
        assert.strictEqual(info.suffix, 'png');
        assert.strictEqual(info.top, 100);
        assert.strictEqual(info.left, 200);
        assert.strictEqual(info.default, 'def');
    });
    it('getInfo：生データではなく、コピーデータが渡される。', () => {
        var store = new LayerStore(layer_data);
        store.getInfo().suffix = 'jpg';
        var info = store.getInfo();
        assert.strictEqual(info.suffix, 'png');
        assert.strictEqual(info.top, 100);
        assert.strictEqual(info.left, 200);
        assert.strictEqual(info.default, 'def');
    });
    it('getDefaultId', () => {
        var store = new LayerStore(layer_data);
        assert.strictEqual(store.getDefaultId(), 'def');
    });
    it('getImages', () => {
        var store = new LayerStore(layer_data);
        assert.strictEqual(store.getImages().map(image => image.id).join(''), 'abc');
    });
    it('getImages：生データなので変更できてしまう。', () => {
        var store = new LayerStore(layer_data);
        store.getImages()[0].id = 'z';
        assert.strictEqual(store.getImages().map(image => image.id).join(''), 'zbc');
    });
    it('getImageIds', () => {
        var store = new LayerStore(layer_data);
        assert.strictEqual(store.getImageIds().join(''), 'abc');
    });
    it('getImageIds：生データではなくコピーデータが渡される。', () => {
        var store = new LayerStore(layer_data);
        store.getImageIds()[0] = 'z';
        assert.strictEqual(store.getImageIds().join(''), 'abc');
    });
    it('getLayerType', () => {
        var store = new LayerStore(layer_data);
        assert.strictEqual(store.getLayerType(), 'tp');
    });
    it('getId', () => {
        var store = new LayerStore(layer_data);
        assert.strictEqual(store.getId(), 'A');
    });
});
