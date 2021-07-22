'use strict';

import assert from 'assert';
import sinon from 'sinon';
import jsdom from 'mocha-jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import Dispatcher from '../../src/dispatcher/Dispatcher';
import LayerImageFactory from '../../src/components/LayerImageFactory';

import LayerImage from '../../src/components/LayerImage';

describe('components/LayerImageFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;
    let base_store;
    let appearance_store;
    let layer_store;
    let path_builder;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();
        callback = {callback(){}};
        base_store = new function(){
            this.getInfo     = function(){ return {
                suffix:'test1',
                width:'100',
            }; };
            this.getState    = function(){ return 'test2'; };
            this.getAlias    = function(){ return 'test2a'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        layer_store = new function(){
            this.getStateArray = function(){ return [{state: 'test3', info:{top: 111, left: 222, suffix: 'test5', }}]; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        appearance_store = new function(){
            this.getScale    = function(){ return '9.9'; }
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        path_builder = new function(){
            this.build = function(path, base, layer, suffix){ return 'builded'; }
        }();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <LayerImageFactory
                path={'test4'}
                path_builder={{test_builder:'test_builder'}}
                base_store={base_store}
                layer_store={layer_store}
                appearance_store={appearance_store}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (<div style={{
            margin: '0 auto',
            position: 'relative',
            transform: 'scale(9.9,9.9)',
            width: '100px'
        }}>
            <LayerImage
                path={'test4'}
                base={'test2'}
                layer=""
                suffix={'test1'}
                builder={{test_builder:'test_builder'}}
                top={0}
                left={0}
                class_name="image"
            />
            <LayerImage
                path={'test4'}
                base={'test2a'}
                layer={'test3'}
                suffix={'test5'}
                builder={{test_builder:'test_builder'}}
                top={111}
                left={222}
                class_name="image"
                key={0}
            />
        </div>);

        expect(actual).toEqualJSX(expected);
    });
    it('mount関連の処理は正しいか。', () => {
        const base_store_addListener = sinon.spy(base_store, 'addListener');
        const appearance_store_addListener = sinon.spy(appearance_store, 'addListener');
        const layer_store_addListener = sinon.spy(layer_store, 'addListener');
        const base_store_removeListener = sinon.spy(base_store, 'removeListener');
        const appearance_store_removeListener = sinon.spy(appearance_store, 'removeListener');
        const layer_store_removeListener = sinon.spy(layer_store, 'removeListener');
        const path_builder_build = sinon.spy(path_builder, 'build');

        const container = document.createElement('div');
        ReactDOM.render(
            <LayerImageFactory
                path={'test4'}
                path_builder={path_builder}
                base_store={base_store}
                layer_store={layer_store}
                appearance_store={appearance_store}
            />
        , container);

        assert.strictEqual(base_store_addListener.callCount, 1);
        assert.strictEqual(appearance_store_addListener.callCount, 1);
        assert.strictEqual(layer_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(base_store_removeListener.callCount, 1);
        assert.strictEqual(appearance_store_removeListener.callCount, 1);
        assert.strictEqual(layer_store_removeListener.callCount, 1);
    });
    it('storeの更新が反映されているか。', () => {
        const base_store_addListener = sinon.spy(base_store, 'addListener');
        const appearance_store_addListener = sinon.spy(appearance_store, 'addListener');
        const layer_store_addListener = sinon.spy(layer_store, 'addListener');
        const path_builder_build = sinon.spy(path_builder, 'build');
        const base_store_getInfo = sinon.stub(base_store, 'getInfo');
        const base_store_getState = sinon.stub(base_store, 'getState');
        const base_store_getAlias = sinon.stub(base_store, 'getAlias');
        const appearance_store_getScale = sinon.stub(appearance_store, 'getScale');
        const layer_store_getStateArray = sinon.stub(layer_store, 'getStateArray');
        //stubにしたため、getBasesの戻りがundefinedになっており、render前に行う必要がある。
        base_store_getInfo.returns({suffix:'xxx', });
        base_store_getState.returns('yyy');
        base_store_getAlias.returns('yyy2');
        appearance_store_getScale.returns('9.9');
        layer_store_getStateArray.returns([{state: 'zzz', info:{top: 111, left: 222, suffix: 'test5', }}]);

        const target = TestUtils.renderIntoDocument(
            <LayerImageFactory
                path={'test4'}
                path_builder={path_builder}
                base_store={base_store}
                layer_store={layer_store}
                appearance_store={appearance_store}
            />
        );

        assert.strictEqual(path_builder_build.callCount, 2);
        assert.deepStrictEqual(
            path_builder_build.getCall(0).args,
            ["test4", "yyy", "", "xxx"]
        );
        assert.deepStrictEqual(
            path_builder_build.getCall(1).args,
            ["test4", "yyy2", "zzz", "test5"]
        );

        //update
        base_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.base_state, 'yyy');
        assert.strictEqual(target.state.base_info.suffix, 'xxx');
        assert.strictEqual(target.state.layer_states[0].state, 'zzz');
        assert.strictEqual(target.state.scale, '9.9');

        base_store_getState.returns('yyyy');
        base_store_getAlias.returns('');
        appearance_store_getScale.returns('8.8');

        //update
        layer_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.base_state, 'yyyy');
        assert.strictEqual(target.state.scale, '8.8');

        base_store_getState.returns('yyyyy');
        appearance_store_getScale.returns('7.7');

        //update
        appearance_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.base_state, 'yyyyy');
        assert.strictEqual(target.state.scale, '7.7');

    });
});
