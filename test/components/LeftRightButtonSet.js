'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import LeftRightButtonSet from '../../src/components/LeftRightButtonSet';

import TagButton from '../../src/components/TagButton';

describe('components/LayerButtonsテスト', () => {
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
            <LeftRightButtonSet
                selected_class={'selected'}
                left_selected={false}
                right_selected={true}
                parts_id={'test1'}
                onClick={callback_click.callback}
                onMouseEnter={callback_mouseenter.callback}
                onMouseLeave={callback_mouseleave.callback}
            >
                test2
            </LeftRightButtonSet>
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <span style={{display: "inline-block"}}>
                <TagButton
                    class_name={'selected'}
                    sender={{id: 'test1', pos: 'both'}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                >{'test2'}</TagButton>
                <TagButton
                    class_name={''}
                    sender={{id: 'test1', pos: 'left'}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                >o</TagButton>
                <TagButton
                    class_name={'selected'}
                    sender={{id: 'test1', pos: 'right'}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                >o</TagButton>　
            </span>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const callback_click_emit = sinon.spy(callback_click, 'callback');
        const callback_mouseenter_emit = sinon.spy(callback_mouseenter, 'callback');
        const callback_mouseleave_emit = sinon.spy(callback_mouseleave, 'callback');

        renderer.render(
            <LeftRightButtonSet
                selected_class={'selected'}
                left_selected={false}
                right_selected={true}
                parts_id={'test1'}
                onClick={callback_click.callback}
                onMouseEnter={callback_mouseenter.callback}
                onMouseLeave={callback_mouseleave.callback}
            />
        );
        let target = renderer.getRenderOutput();

        target.props.children[0].props.onClick({id: 'xxx1', pos: 'xxx2'});

        assert.strictEqual(callback_click_emit.callCount, 1);
        assert.strictEqual(callback_click_emit.getCall(0).args[0], 'xxx1');
        assert.strictEqual(callback_click_emit.getCall(0).args[1], 'xxx2');

        target.props.children[0].props.onMouseEnter({id: 'yyy1', pos: 'yyy2'});

        assert.strictEqual(callback_mouseenter_emit.callCount, 1);
        assert.strictEqual(callback_mouseenter_emit.getCall(0).args[0], 'yyy1');
        assert.strictEqual(callback_mouseenter_emit.getCall(0).args[1], 'yyy2');

        target.props.children[0].props.onMouseLeave({id: 'zzz1', pos: 'zzz2'});

        assert.strictEqual(callback_mouseleave_emit.callCount, 1);
        assert.strictEqual(callback_mouseleave_emit.getCall(0).args[0], 'zzz1');
        assert.strictEqual(callback_mouseleave_emit.getCall(0).args[1], 'zzz2');


        target.props.children[1].props.onClick({id: 'xxx3', pos: 'xxx4'});

        assert.strictEqual(callback_click_emit.callCount, 2);
        assert.strictEqual(callback_click_emit.getCall(1).args[0], 'xxx3');
        assert.strictEqual(callback_click_emit.getCall(1).args[1], 'xxx4');

        target.props.children[1].props.onMouseEnter({id: 'yyy3', pos: 'yyy4'});

        assert.strictEqual(callback_mouseenter_emit.callCount, 2);
        assert.strictEqual(callback_mouseenter_emit.getCall(1).args[0], 'yyy3');
        assert.strictEqual(callback_mouseenter_emit.getCall(1).args[1], 'yyy4');

        target.props.children[1].props.onMouseLeave({id: 'zzz3', pos: 'zzz4'});

        assert.strictEqual(callback_mouseleave_emit.callCount, 2);
        assert.strictEqual(callback_mouseleave_emit.getCall(1).args[0], 'zzz3');
        assert.strictEqual(callback_mouseleave_emit.getCall(1).args[1], 'zzz4');


        target.props.children[1].props.onClick({id: 'xxx5', pos: 'xxx6'});

        assert.strictEqual(callback_click_emit.callCount, 3);
        assert.strictEqual(callback_click_emit.getCall(2).args[0], 'xxx5');
        assert.strictEqual(callback_click_emit.getCall(2).args[1], 'xxx6');

        target.props.children[1].props.onMouseEnter({id: 'yyy5', pos: 'yyy6'});

        assert.strictEqual(callback_mouseenter_emit.callCount, 3);
        assert.strictEqual(callback_mouseenter_emit.getCall(2).args[0], 'yyy5');
        assert.strictEqual(callback_mouseenter_emit.getCall(2).args[1], 'yyy6');

        target.props.children[1].props.onMouseLeave({id: 'zzz5', pos: 'zzz6'});

        assert.strictEqual(callback_mouseleave_emit.callCount, 3);
        assert.strictEqual(callback_mouseleave_emit.getCall(2).args[0], 'zzz5');
        assert.strictEqual(callback_mouseleave_emit.getCall(2).args[1], 'zzz6');
    });
});
