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

import ListRawFactory from '../../src/components/ListRawFactory';

import Dispatcher from '../../src/dispatcher/Dispatcher';
import TagButton from '../../src/components/TagButton';
import ListRawAction from '../../src/actions/ListRawAction';
import ListRawConstants from '../../src/actions/ListRawConstants';
import StateStringListAction from '../../src/actions/StateStringListAction';
import StateStringListConstants from '../../src/actions/StateStringListConstants';
import TooltipAction from '../../src/actions/TooltipAction';
import TooltipConstants from '../../src/actions/TooltipConstants';
import TooltipArea from '../../src/components/TooltipArea';

describe('components/ListRawFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;
    let raw_action;
    let list_action;
    let tooltip_action;
    let raw_store;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();
        callback = {callback(){}};
        raw_action = new ListRawAction(dispatcher);
        list_action = new StateStringListAction(dispatcher);
        tooltip_action = new TooltipAction(dispatcher);
        raw_store = new function(){
            this.getRaw = function(){ return 'test1'; };
            this.getRawByArray = function(){ return ['test2', 'test3333']; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <ListRawFactory
                raw_store={raw_store}
                raw_action={raw_action}
                list_action={list_action}
                tooltip_action={tooltip_action}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <TooltipArea
                tooltip_action={tooltip_action}
                tooltip_caption="差分情報のリストデータを取り扱います。"
            >
                <textarea
                    rows={3}
                    cols={8}
                    onChange={()=>{}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    value={'test1'}
                >{'test1'}</textarea><br/>
                <TagButton
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                >リストに反映させる</TagButton>
            </TooltipArea>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('mount関連の処理は正しいか。', () => {
        const raw_store_addListener = sinon.spy(raw_store, 'addListener');
        const raw_store_removeListener = sinon.spy(raw_store, 'removeListener');

        const container = document.createElement('div');
        ReactDOM.render(
            <ListRawFactory
                raw_store={raw_store}
                raw_action={raw_action}
                list_action={list_action}
                tooltip_action={tooltip_action}
            />
        , container);

        assert.strictEqual(raw_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(raw_store_removeListener.callCount, 1);
    });
    it('イベントが正しく伝わっているか。', () => {
        const dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        const event = {target:{value: '', select: ()=>{},}};
        const event_target_select = sinon.spy(event.target, 'select');

        renderer.render(
            <ListRawFactory
                raw_store={raw_store}
                raw_action={raw_action}
                list_action={list_action}
                tooltip_action={tooltip_action}
            />
        );
        const target = renderer.getRenderOutput();

        target.props.children[0].props.onChange({target: {value: 'xxx'}});

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, ListRawConstants.UPDATE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].raw, 'xxx');

        event.target.value = 'xxxx';
        target.props.children[0].props.onClick(event);

        assert.strictEqual(event_target_select.callCount, 1);
        assert.strictEqual(event_target_select.getCall(0).args[0], 0);
        assert.strictEqual(event_target_select.getCall(0).args[1], 4);

        target.props.children[0].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 2);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].message, '差分情報のリストがテキストになっています。コピペして保存できます。');

        target.props.children[2].props.onClick();

        assert.strictEqual(dispatcher_dispatch.callCount, 6);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].action_type, StateStringListConstants.CLEAR);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].action_type, StateStringListConstants.ADD_RAW);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].raw, 'test2');
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].action_type, StateStringListConstants.ADD_RAW);
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].raw, 'test3333');
        assert.strictEqual(dispatcher_dispatch.getCall(5).args[0].action_type, StateStringListConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(5).args[0].index, 0);

        target.props.children[2].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 7);
        assert.strictEqual(dispatcher_dispatch.getCall(6).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(6).args[0].message, 'テキストを差分情報のリストに登録します。');

    });
    it('storeの更新が反映されているか。', () => {
        const raw_store_addListener = sinon.spy(raw_store, 'addListener');
        const raw_store_getRaw = sinon.stub(raw_store, 'getRaw');
        raw_store_getRaw.returns('xxx');

        const target = TestUtils.renderIntoDocument(
            <ListRawFactory
                raw_store={raw_store}
                raw_action={raw_action}
                list_action={list_action}
                tooltip_action={tooltip_action}
            />
        );

        raw_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.raw_text, 'xxx');

    });
});
