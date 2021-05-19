'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import Comment from '../../src/components/Comment';

describe('components/Commentテスト', () => {
    let renderer;
    let callback_change;
    let callback_mouseenter;
    let event;

    beforeEach(() => {
        renderer = new ShallowRenderer();
        callback_change = {callback(){}};
        callback_mouseenter = {callback(){}};
        event = {target:{value: '', select: ()=>{},}};
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <Comment
                comment={'test1'}
                class_name={'test2'}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <input type="text"
                size={5}
                value={'test1'}
                className={'test2'}
                onChange={()=>{}}
                onClick={()=>{}}
                onMouseEnter={()=>{}}
            />
        );

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const callback_change_emit = sinon.spy(callback_change, 'callback');
        const callback_mouseenter_emit = sinon.spy(callback_mouseenter, 'callback');
        const event_target_select = sinon.spy(event.target, 'select');

        renderer.render(
            <Comment
                comment={'test1'}
                class_name={'test2'}
                onChange={callback_change.callback}
                onMouseEnter={callback_mouseenter.callback}
            />
        );
        let target = renderer.getRenderOutput();

        event.target.value = 'test3';
        target.props.onChange(event);

        assert.strictEqual(callback_change_emit.callCount, 1);
        assert.strictEqual(callback_change_emit.getCall(0).args[0], 'test3');

        event.target.value = 'test4';
        target.props.onMouseEnter(event);

        assert.strictEqual(callback_mouseenter_emit.callCount, 1);
        assert.strictEqual(typeof callback_mouseenter_emit.getCall(0).args[0], 'undefined');

        event.target.value = 'xxx';
        target.props.onClick(event);

        assert.strictEqual(event_target_select.callCount, 1);
        assert.strictEqual(event_target_select.getCall(0).args[0], 0);
        assert.strictEqual(event_target_select.getCall(0).args[1], 3);

    });
});
