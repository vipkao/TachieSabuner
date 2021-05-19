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

import StateStringListFactory from '../../src/components/StateStringListFactory';
import TagButton from '../../src/components/TagButton';
import Dispatcher from '../../src/dispatcher/Dispatcher';
import StateStringListAction from '../../src/actions/StateStringListAction';
import StateStringListConstants from '../../src/actions/StateStringListConstants';
import StateStringAction from '../../src/actions/StateStringAction';
import StateStringConstants from '../../src/actions/StateStringConstants';
import TooltipAction from '../../src/actions/TooltipAction';
import TooltipConstants from '../../src/actions/TooltipConstants';

describe('components/StateStringFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;

    let list_action;
    let state_action;
    let tooltip_action;
    let list_store;
    let state_store;
    let comment_store;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();
        callback = {callback(){}};
        list_action = new StateStringListAction(dispatcher);
        state_action = new StateStringAction(dispatcher);
        tooltip_action = new TooltipAction(dispatcher);
        list_store = new function(){
            this.getRawStrings = function(){ return ['test1', 'test2']; };
            this.isSelected = function(){ return true; };
            this.getIndex = function(){ return 'test2'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        state_store = new function(){
            this.getStateString = function(){ return 'test3'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        comment_store = new function(){
            this.getComment = function(){ return 'test4'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <StateStringListFactory
                list_store={list_store}
                list_action={list_action}
                state_store={state_store}
                comment_store={comment_store}
                state_action={state_action}
                tooltip_action={tooltip_action}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <div>
                <TagButton
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                >リストに追加</TagButton>
                <TagButton
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                >リストから削除</TagButton>
                <TagButton
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                >上げる</TagButton>
                <TagButton
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                >下げる</TagButton>
                <br/>
                <select
                    size={2}
                    value={'test2'}
                    onChange={()=>{}}
                    onMouseEnter={()=>{}}
                >
                    <option
                        value={0}
                        key={0}
                    >{'test1'}</option>
                    <option
                        value={1}
                        key={1}
                    >{'test2'}</option>
                </select>
            </div>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('mount関連の処理は正しいか。', () => {
        const list_store_addListener = sinon.spy(list_store, 'addListener');
        const list_store_removeListener = sinon.spy(list_store, 'removeListener');

        const container = document.createElement('div');
        ReactDOM.render(
            <StateStringListFactory
                list_store={list_store}
                list_action={list_action}
                state_store={state_store}
                comment_store={comment_store}
                state_action={state_action}
                tooltip_action={tooltip_action}
            />
        , container);

        assert.strictEqual(list_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(list_store_removeListener.callCount, 1);
    });
    it('イベントが正しく伝わっているか。', () => {
        const dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');

        renderer.render(
            <StateStringListFactory
                list_store={list_store}
                list_action={list_action}
                state_store={state_store}
                comment_store={comment_store}
                state_action={state_action}
                tooltip_action={tooltip_action}
            />
        );
        const target = renderer.getRenderOutput();

        target.props.children[0].props.onClick();

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.ADD);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].comment, 'test4');
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].state_string, 'test3');

        target.props.children[0].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 2);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].message, '現在の差分情報をリストに追加します。');

        target.props.children[1].props.onClick();

        assert.strictEqual(dispatcher_dispatch.callCount, 3);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].action_type, StateStringListConstants.REMOVE);

        target.props.children[1].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 4);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].message, '選択中の差分情報をリストから削除します。');

        target.props.children[2].props.onClick();

        assert.strictEqual(dispatcher_dispatch.callCount, 5);
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].action_type, StateStringListConstants.UP);

        target.props.children[2].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 6);
        assert.strictEqual(dispatcher_dispatch.getCall(5).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(5).args[0].message, '選択中の差分情報の順番を入れ替えます。');

        target.props.children[3].props.onClick();

        assert.strictEqual(dispatcher_dispatch.callCount, 7);
        assert.strictEqual(dispatcher_dispatch.getCall(6).args[0].action_type, StateStringListConstants.DOWN);

        target.props.children[3].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 8);
        assert.strictEqual(dispatcher_dispatch.getCall(7).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(7).args[0].message, '選択中の差分情報の順番を入れ替えます。');

        target.props.children[5].props.onChange({target: {value: 1}});

        assert.strictEqual(dispatcher_dispatch.callCount, 9);
        assert.strictEqual(dispatcher_dispatch.getCall(8).args[0].action_type, StateStringListConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(8).args[0].index, 1);

        target.props.children[5].props.onMouseEnter();

        assert.strictEqual(dispatcher_dispatch.callCount, 10);
        assert.strictEqual(dispatcher_dispatch.getCall(9).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(9).args[0].message, 'リストの差分情報を選択してください。表示に反映されます。');
    });
    it('storeの更新が反映されているか。', () => {
        const list_store_addListener = sinon.spy(list_store, 'addListener');
        const list_store_getRawStrings = sinon.stub(list_store, 'getRawStrings');
        const list_store_isSelected = sinon.stub(list_store, 'isSelected');
        const list_store_getIndex = sinon.stub(list_store, 'getIndex');

        //stubにしたため、getBasesの戻りがundefinedになっており、render前に行う必要がある。
        list_store_getRawStrings.returns(['xxx1', 'yyy1']);
        list_store_isSelected.returns(true);
        list_store_getIndex.returns(1);

        const target = TestUtils.renderIntoDocument(
            <StateStringListFactory
                list_store={list_store}
                list_action={list_action}
                state_store={state_store}
                comment_store={comment_store}
                state_action={state_action}
                tooltip_action={tooltip_action}
            />
        );

        list_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.state_strings[0], 'xxx1');
        assert.strictEqual(target.state.state_strings[1], 'yyy1');
        assert.strictEqual(target.state.selected_index, 1);
        assert.strictEqual(target.state.length, 2);

        list_store_isSelected.returns(false);
        list_store_getIndex.returns(2);

        list_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.selected_index, '');
    });
});
