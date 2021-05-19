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

import TooltipFactory from '../../src/components/TooltipFactory';
import Dispatcher from '../../src/dispatcher/Dispatcher';

import TooltipAction from '../../src/actions/TooltipAction';
import TooltipConstants from '../../src/actions/TooltipConstants';

describe('components/TooltipFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;
    let tooltip_store;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();
        tooltip_store = new function(){
            this.getMessage  = function(){ return 'test1'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <TooltipFactory
                tooltip_store={tooltip_store}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <span>[
                {'test1'}
            ]</span>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('mount関連の処理は正しいか。', () => {
        const tooltip_store_addListener = sinon.spy(tooltip_store, 'addListener');
        const tooltip_store_removeListener = sinon.spy(tooltip_store, 'removeListener');

        const container = document.createElement('div');
        ReactDOM.render(
            <TooltipFactory
                tooltip_store={tooltip_store}
            />
        , container);

        assert.strictEqual(tooltip_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(tooltip_store_removeListener.callCount, 1);
    });
    it('storeの更新が反映されているか。', () => {
        const tooltip_store_addListener = sinon.spy(tooltip_store, 'addListener');
        const tooltip_store_getMessage = sinon.stub(tooltip_store, 'getMessage');
        //stubにしたため、getBasesの戻りがundefinedになっており、render前に行う必要がある。
        tooltip_store_getMessage.returns('xxx');

        const target = TestUtils.renderIntoDocument(
            <TooltipFactory
                tooltip_store={tooltip_store}
            />
        );

        tooltip_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.message, 'xxx');

        tooltip_store_getMessage.returns('yyy');

        tooltip_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.message, 'yyy');
    });
});
