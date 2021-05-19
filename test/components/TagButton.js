'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import TagButton from '../../src/components/TagButton';

describe('components/TagButtonテスト', () => {
    let renderer;
    let callback_click;
    let callback_mouseenter;
    let callback_mouseleave;

    beforeEach(() => {
        renderer = new ShallowRenderer();
        callback_click = {callback(){}};
        callback_mouseenter = {callback(){}};
        callback_mouseleave = {callback(){}};
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <TagButton
                class_name={'test1'}
                onClick={callback_click.callback}
                onMouseEnter={callback_mouseenter.callback}
                onMouseLeave={callback_mouseleave.callback}
            >
                {'test3'}
            </TagButton>
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <button
                className={'test1'}
                onClick={callback_click.callback}
                onMouseEnter={callback_mouseenter.callback}
                onMouseLeave={callback_mouseleave.callback}
            >
                {'test3'}
            </button>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const callback_click_emit = sinon.spy(callback_click, 'callback');
        const callback_mouseenter_emit = sinon.spy(callback_mouseenter, 'callback');
        const callback_mouseleave_emit = sinon.spy(callback_mouseleave, 'callback');

        renderer.render(
            <TagButton
                class_name={'test1'}
                sender={{id: 'test2'}}
                onClick={callback_click.callback}
                onMouseEnter={callback_mouseenter.callback}
                onMouseLeave={callback_mouseleave.callback}
            >
                {'test3'}
            </TagButton>
        );
        let target = renderer.getRenderOutput();

        target.props.onClick();

        assert.strictEqual(callback_click_emit.callCount, 1);
        assert.strictEqual(callback_mouseenter_emit.callCount, 0);
        assert.strictEqual(callback_mouseleave_emit.callCount, 0);
        assert.strictEqual(callback_click_emit.getCall(0).args[0].id, 'test2');

        target.props.onMouseEnter();

        assert.strictEqual(callback_click_emit.callCount, 1);
        assert.strictEqual(callback_mouseenter_emit.callCount, 1);
        assert.strictEqual(callback_mouseleave_emit.callCount, 0);
        assert.strictEqual(callback_mouseenter_emit.getCall(0).args[0].id, 'test2');

        target.props.onMouseLeave();

        assert.strictEqual(callback_click_emit.callCount, 1);
        assert.strictEqual(callback_mouseenter_emit.callCount, 1);
        assert.strictEqual(callback_mouseleave_emit.callCount, 1);
        assert.strictEqual(callback_mouseleave_emit.getCall(0).args[0].id, 'test2');
    });
});
