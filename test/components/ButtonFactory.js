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
import ButtonFactory from '../../src/components/ButtonFactory';
import BaseButtons from '../../src/components/BaseButtons';
import LayerButtons from '../../src/components/LayerButtons';
import AppearanceAction from '../../src/actions/AppearanceAction';
import AppearanceConstants from '../../src/actions/AppearanceConstants';
import BaseAction from '../../src/actions/BaseAction';
import BaseConstants from '../../src/actions/BaseConstants';
import LayerAction from '../../src/actions/LayerAction';
import LayerConstants from '../../src/actions/LayerConstants';
import ScaleList from '../../src/components/ScaleList';
import TooltipAction from '../../src/actions/TooltipAction'
import TooltipArea from '../../src/components/TooltipArea';

describe('components/ButtonFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;
    let appearance_action;
    let base_action;
    let layer_action;
    let tooltip_action;
    let appearance_store;
    let base_store;
    let layer_store;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();
        callback = {callback(){}};
        appearance_action = new AppearanceAction(dispatcher);
        base_action = new BaseAction(dispatcher);
        layer_action = new LayerAction(dispatcher);
        tooltip_action = new TooltipAction(dispatcher);
        appearance_store = new function(){
            this.getScale    = function(){ return '3.0'; };
            this.getScaleList    = function(){ return ['s1', 's2']; };
            this.getScaleIndex    = function(){ return 2; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        base_store = new function(){
            this.getBases    = function(){ return [{'test1':'test1'}]; };
            this.getState    = function(){ return 'test2'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        layer_store = new function(){
            this.getLayers   = function(){ return [{'test3':'test3'}]; };
            this.getState    = function(){ return {test4:'test4'}; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <ButtonFactory
                appearance_store={appearance_store}
                base_store={base_store}
                layer_store={layer_store}
                appearance_action={appearance_action}
                base_action={base_action}
                layer_action={layer_action}
                tooltip_action={tooltip_action}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (<TooltipArea
            tooltip_action={tooltip_action}
            tooltip_caption="差分を組み立てます。"
        >
            <ScaleList
                scales={['s1','s2']}
                selected={2}
            />
            <BaseButtons
                bases={[{'test1':'test1'}]}
                selected={'test2'}
            />
            <LayerButtons
                layers={[{'test3':'test3'}]}
                selected={{test4:'test4'}}
            />
        </TooltipArea>);

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');

        renderer.render(
            <ButtonFactory
                appearance_store={appearance_store}
                base_store={base_store}
                layer_store={layer_store}
                appearance_action={appearance_action}
                base_action={base_action}
                layer_action={layer_action}
                tooltip_action={tooltip_action}
            />
        );
        const target = renderer.getRenderOutput();

        target.props.children[1].props.onSelect('test5');

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, BaseConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].id, 'test5');

        target.props.children[2].props.onSelect('test6', 'test7');

        assert.strictEqual(dispatcher_dispatch.callCount, 2);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].action_type, LayerConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].layer_id, 'test6');
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].parts_id, 'test7');

        target.props.children[2].props.onStartPreview('test8', 'test9');

        assert.strictEqual(dispatcher_dispatch.callCount, 3);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].action_type, LayerConstants.START_PREVIEW);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].layer_id, 'test8');
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].parts_id, 'test9');

        target.props.children[2].props.onEndPreview('test10', 'test11');

        assert.strictEqual(dispatcher_dispatch.callCount, 4);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].action_type, LayerConstants.END_PREVIEW);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].layer_id, 'test10');
        assert.strictEqual(typeof dispatcher_dispatch.getCall(3).args[0].parts_id, 'undefined');

        target.props.children[0].props.onSelect(1);

        assert.strictEqual(dispatcher_dispatch.callCount, 5);
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].action_type, AppearanceConstants.SCALE);
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].index, 1);

    });
    it('mount関連の処理は正しいか。', () => {
        const appearance_store_addListener = sinon.spy(appearance_store, 'addListener');
        const base_store_addListener = sinon.spy(base_store, 'addListener');
        const layer_store_addListener = sinon.spy(layer_store, 'addListener');
        const appearance_store_removeListener = sinon.spy(appearance_store, 'removeListener');
        const base_store_removeListener = sinon.spy(base_store, 'removeListener');
        const layer_store_removeListener = sinon.spy(layer_store, 'removeListener');

        const container = document.createElement('div');
        ReactDOM.render(
            <ButtonFactory
                appearance_store={appearance_store}
                base_store={base_store}
                layer_store={layer_store}
                appearance_action={appearance_action}
                base_action={base_action}
                layer_action={layer_action}
                tooltip_action={tooltip_action}
            />
        , container);

        assert.strictEqual(appearance_store_addListener.callCount, 1);
        assert.strictEqual(base_store_addListener.callCount, 1);
        assert.strictEqual(layer_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(appearance_store_removeListener.callCount, 1);
        assert.strictEqual(base_store_removeListener.callCount, 1);
        assert.strictEqual(layer_store_removeListener.callCount, 1);
    });
    it('storeの更新が反映されているか。', () => {
        const appearance_store_addListener = sinon.spy(appearance_store, 'addListener');
        const base_store_addListener = sinon.spy(base_store, 'addListener');
        const layer_store_addListener = sinon.spy(layer_store, 'addListener');
        const appearance_store_getScaleIndex = sinon.stub(appearance_store, 'getScaleIndex');
        const base_store_getBases = sinon.stub(base_store, 'getBases');
        const layer_store_getLayers = sinon.stub(layer_store, 'getLayers');
        //stubにしたため、getBasesの戻りがundefinedになっており、render前に行う必要がある。
        base_store_getBases.returns([{'xxx':'xxx'}]);
        layer_store_getLayers.returns(['xxx']);
        appearance_store_getScaleIndex.returns(2);

        const target = TestUtils.renderIntoDocument(
            <ButtonFactory
                appearance_store={appearance_store}
                base_store={base_store}
                layer_store={layer_store}
                appearance_action={appearance_action}
                base_action={base_action}
                layer_action={layer_action}
                tooltip_action={tooltip_action}
            />
        );

        base_store_addListener.getCall(0).args[0]();

        assert.deepStrictEqual(target.state.bases[0], {'xxx':'xxx'});
        assert.strictEqual(target.state.layers[0], 'xxx');
        assert.strictEqual(target.state.scale_selected, 2);


        base_store_getBases.returns([{'zzz':'zzz'}]);
        layer_store_getLayers.returns(['zzz']);

        layer_store_addListener.getCall(0).args[0]();

        assert.deepStrictEqual(target.state.bases[0], {'zzz':'zzz'});
        assert.strictEqual(target.state.layers[0], 'zzz');


        appearance_store_getScaleIndex.returns(0);

        appearance_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.scale_selected, 0);
    });
});
