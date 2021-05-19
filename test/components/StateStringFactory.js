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

import StateStringFactory from '../../src/components/StateStringFactory';
import Comment from '../../src/components/Comment';
import StateString from '../../src/components/StateString';
import Dispatcher from '../../src/dispatcher/Dispatcher';
import StateStringAction from '../../src/actions/StateStringAction';
import StateStringConstants from '../../src/actions/StateStringConstants';
import CommentAction from '../../src/actions/CommentAction';
import CommentConstants from '../../src/actions/CommentConstants';
import TooltipAction from '../../src/actions/TooltipAction';
import TooltipConstants from '../../src/actions/TooltipConstants';

describe('components/StateStringFactoryテスト', () => {

    let dispatcher;
    let renderer;
    let callback;

    let text_store;
    let text_action;
    let comment_store;
    let comment_action;
    let state_string_action;
    let tooltip_action;

    //mocha-jsdomはmochaのbeforeとafterで処理をするため、ここで実行する
    jsdom({globalize: true});

    beforeEach(() => {
        dispatcher = new Dispatcher();
        renderer = new ShallowRenderer();
        callback = {callback(){}};
        text_action = new StateStringAction(dispatcher);
        comment_action = new CommentAction(dispatcher);
        state_string_action = new StateStringAction(dispatcher);
        tooltip_action = new TooltipAction(dispatcher);
        comment_store = new function(){
            this.getComment  = function(){ return 'test1'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
        text_store = new function(){
            this.getStateString = function(){ return 'test2'; };
            this.addListener = function(){};
            this.removeListener = function(){};
        }();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <StateStringFactory
                text_store={text_store}
                text_action={text_action}
                comment_store={comment_store}
                comment_action={comment_action}
                state_string_action={state_string_action}
                tooltip_action={tooltip_action}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <div>
                <Comment
                    comment={'test1'}
                    onChange={()=>{}}
                    onMouseEnter={()=>{}}
                />
                <StateString
                    state_string={'test2'}
                    onInputChange={()=>{}}
                    onInputMouseEnter={()=>{}}
                    onButtonClick={()=>{}}
                    onButtonMouseEnter={()=>{}}
                >表示に反映</StateString>
            </div>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('mount関連の処理は正しいか。', () => {
        const comment_store_addListener = sinon.spy(comment_store, 'addListener');
        const text_store_addListener = sinon.spy(text_store, 'addListener');
        const comment_store_removeListener = sinon.spy(comment_store, 'removeListener');
        const text_store_removeListener = sinon.spy(text_store, 'removeListener');

        const container = document.createElement('div');
        ReactDOM.render(
            <StateStringFactory
                text_store={text_store}
                text_action={text_action}
                comment_store={comment_store}
                comment_action={comment_action}
                state_string_action={state_string_action}
                tooltip_action={tooltip_action}
            />
        , container);

        assert.strictEqual(comment_store_addListener.callCount, 1);
        assert.strictEqual(text_store_addListener.callCount, 1);

        ReactDOM.unmountComponentAtNode(container);

        assert.strictEqual(comment_store_removeListener.callCount, 1);
        assert.strictEqual(text_store_removeListener.callCount, 1);
    });
    it('イベントが正しく伝わっているか。', () => {
        const dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');

        renderer.render(
            <StateStringFactory
                text_store={text_store}
                text_action={text_action}
                comment_store={comment_store}
                comment_action={comment_action}
                state_string_action={state_string_action}
                tooltip_action={tooltip_action}
            />
        );
        const target = renderer.getRenderOutput();

        target.props.children[0].props.onChange('test3');

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, CommentConstants.CHANGE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].comment, 'test3');

        target.props.children[0].props.onMouseEnter('test4');

        assert.strictEqual(dispatcher_dispatch.callCount, 2);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(1).args[0].message, '差分情報に分かりやすいコメントを付けることができます。');

        target.props.children[1].props.onInputChange('test5');

        assert.strictEqual(dispatcher_dispatch.callCount, 3);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].action_type, StateStringConstants.EDITING_STRING);
        assert.strictEqual(dispatcher_dispatch.getCall(2).args[0].state_string, 'test5');

        target.props.children[1].props.onInputMouseEnter('test6');

        assert.strictEqual(dispatcher_dispatch.callCount, 4);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(3).args[0].message, '現在の差分情報がテキストになっています。コピペしたり編集できます。');

        target.props.children[1].props.onButtonClick('test7');

        assert.strictEqual(dispatcher_dispatch.callCount, 5);
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].action_type, StateStringConstants.UPDATE_STRING);
        assert.strictEqual(dispatcher_dispatch.getCall(4).args[0].state_string, 'test2');

        target.props.children[1].props.onButtonMouseEnter('test8');

        assert.strictEqual(dispatcher_dispatch.callCount, 6);
        assert.strictEqual(dispatcher_dispatch.getCall(5).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(5).args[0].message, '差分情報のテキストを実際の表示に反映させます。');
    });
    it('storeの更新が反映されているか。', () => {
        const text_store_addListener = sinon.spy(text_store, 'addListener');
        const comment_store_addListener = sinon.spy(comment_store, 'addListener');
        const text_store_getStateString = sinon.stub(text_store, 'getStateString');
        const comment_store_getComment = sinon.stub(comment_store, 'getComment');
        //stubにしたため、getBasesの戻りがundefinedになっており、render前に行う必要がある。
        text_store_getStateString.returns('xxx1');
        comment_store_getComment.returns('yyy1');

        const target = TestUtils.renderIntoDocument(
            <StateStringFactory
                text_store={text_store}
                text_action={text_action}
                comment_store={comment_store}
                comment_action={comment_action}
                state_string_action={state_string_action}
                tooltip_action={tooltip_action}
            />
        );

        text_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.state_string, 'xxx1');
        assert.strictEqual(target.state.comment, 'yyy1');

        text_store_getStateString.returns('xxx2');
        comment_store_getComment.returns('yyy2');

        comment_store_addListener.getCall(0).args[0]();

        assert.strictEqual(target.state.state_string, 'xxx2');
        assert.strictEqual(target.state.comment, 'yyy2');

    });
});
