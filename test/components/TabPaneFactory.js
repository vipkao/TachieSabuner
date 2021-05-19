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

import TabPaneFactory from '../../src/components/TabPaneFactory';
import TagButton from '../../src/components/TagButton';

import Dispatcher from '../../src/dispatcher/Dispatcher';

import TabPaneAction from '../../src/actions/TabPaneAction';
import TabPaneConstants from '../../src/actions/TabPaneConstants';
import TooltipAction from '../../src/actions/TooltipAction';
import TooltipConstants from '../../src/actions/TooltipConstants';

describe('components/TabPaneFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;

    let pane_action;
    let tooltip_action;
    let pane_store;
    let pane_components;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();

        pane_action = new TabPaneAction(dispatcher);
        tooltip_action = new TooltipAction(dispatcher);
        pane_store = new function(){
            this.getActivePaneId = function(){ return 1; };
            this.getPaneInfos    = function(){ return [
                {id: 0, caption: 'test2cap', tooltip: 'test2tip'},
                {id: 1, caption: 'test3cap', tooltip: 'test3tip'},
            ]; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        pane_components = [ 'test4', 'test5'];
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <TabPaneFactory
                caption="機能一覧："
                pane_store={pane_store}
                pane_action={pane_action}
                pane_components={pane_components}
                tooltip_action={tooltip_action}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <div>
                <span>
                    機能一覧：
                </span>
                <div>
                    <TagButton
                        class_name={''}
                        sender={{id: 0, tooltip: 'test2tip', }}
                        key={0}
                        onClick={()=>{}}
                        onMouseEnter={()=>{}}
                    >{'test2cap'}</TagButton>
                    <TagButton
                        class_name={'selected'}
                        sender={{id: 1, tooltip: 'test3tip', }}
                        key={1}
                        onClick={()=>{}}
                        onMouseEnter={()=>{}}
                    >{'test3cap'}</TagButton>
                </div>
                <hr/>
                {'test5'}
            </div>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('mount関連の処理は正しいか。', () => {
        const pane_store_addListener = sinon.spy(pane_store, 'addListener');
        const pane_store_removeListener = sinon.spy(pane_store, 'removeListener');

        const container = document.createElement('div');
        ReactDOM.render(
            <TabPaneFactory
                pane_store={pane_store}
                pane_action={pane_action}
                pane_components={pane_components}
                tooltip_action={tooltip_action}
            />
        , container);

        assert.strictEqual(pane_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(pane_store_removeListener.callCount, 1);
    });
    it('イベントが正しく伝わっているか。', () => {
        const dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');

        renderer.render(
            <TabPaneFactory
                pane_store={pane_store}
                pane_action={pane_action}
                pane_components={pane_components}
                tooltip_action={tooltip_action}
            />
        );
        const target = renderer.getRenderOutput();

        target.props.children[1].props.children[0].props.onClick({id: 'xxx1'});

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, TabPaneConstants.CHANGE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].pane_id, 'xxx1');

        target.props.children[1].props.children[0].props.onMouseEnter({tooltip: 'xxx2'});

        assert.strictEqual(dispatcher_dispatch.callCount, 2);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].message, 'xxx2');

        target.props.children[1].props.children[1].props.onClick({id: 'xxx3'});

        assert.strictEqual(dispatcher_dispatch.callCount, 3);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].action_type, TabPaneConstants.CHANGE);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].pane_id, 'xxx3');

        target.props.children[1].props.children[1].props.onMouseEnter({tooltip: 'xxx4'});

        assert.strictEqual(dispatcher_dispatch.callCount, 4);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].message, 'xxx4');
    });
    it('storeの更新が反映されているか。', () => {
        const pane_store_addListener = sinon.spy(pane_store, 'addListener');
        const pane_store_getActivePaneId = sinon.stub(pane_store, 'getActivePaneId');
        //stubにしたため、getBasesの戻りがundefinedになっており、render前に行う必要がある。
        pane_store_getActivePaneId.returns(0);

        const target = TestUtils.renderIntoDocument(
            <TabPaneFactory
                pane_store={pane_store}
                pane_action={pane_action}
                pane_components={pane_components}
                tooltip_action={tooltip_action}
            />
        );

        pane_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.pane_infos[0].id, 0);
        assert.strictEqual(target.state.pane_infos[0].caption, 'test2cap');
        assert.strictEqual(target.state.pane_infos[0].active, true);
        assert.strictEqual(target.state.pane_infos[0].tooltip, 'test2tip');
        assert.strictEqual(target.state.pane_infos[1].id, 1);
        assert.strictEqual(target.state.pane_infos[1].caption, 'test3cap');
        assert.strictEqual(target.state.pane_infos[1].active, false);
        assert.strictEqual(target.state.pane_infos[1].tooltip, 'test3tip');
        assert.strictEqual(target.state.active_component, 'test4');

        pane_store_getActivePaneId.returns(1);

        pane_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.pane_infos[0].active, false);
        assert.strictEqual(target.state.pane_infos[1].active, true);
        assert.strictEqual(target.state.active_component, 'test5');

    });
});
