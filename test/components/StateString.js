'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import StateString from '../../src/components/StateString';
import TagButton from '../../src/components/TagButton';

describe('components/StateStringテスト', () => {
    let renderer;
    let cb_input_change;
    let cb_input_mouse_enter;
    let cb_button_click;
    let cb_button_mouse_enter;

    beforeEach(() => {
        renderer = new ShallowRenderer();
        cb_input_change = {callback(){}};
        cb_input_mouse_enter = {callback(){}};
        cb_button_click = {callback(){}};
        cb_button_mouse_enter = {callback(){}};
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <StateString
                state_string={'test1'}
                onInputChange={()=>{}}
                onInputMouseEnter={()=>{}}
                onButtonClick={()=>{}}
                onButtonMouseEnter={()=>{}}
            >
                {'test2'}
            </StateString>
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <span>
                <input type="text"
                    value={'test1'}
                    onChange={()=>{}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                />
                <TagButton
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                >
                    {'test2'}
                </TagButton>
            </span>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const cb_input_change_emit = sinon.spy(cb_input_change, 'callback');
        const cb_input_mouse_enter_emit = sinon.spy(cb_input_mouse_enter, 'callback');
        const cb_button_click_emit = sinon.spy(cb_button_click, 'callback');
        const cb_button_mouse_enter_emit = sinon.spy(cb_button_mouse_enter, 'callback');
        const event = {target:{value: '', select: ()=>{},}};
        const event_target_select = sinon.spy(event.target, 'select');

        renderer.render(
            <StateString
                state_string={'test1'}
                onInputChange={cb_input_change.callback}
                onInputMouseEnter={cb_input_mouse_enter.callback}
                onButtonClick={cb_button_click.callback}
                onButtonMouseEnter={cb_button_mouse_enter.callback}
            />
        );
        let target = renderer.getRenderOutput();

        target.props.children[0].props.onChange({target:{value:'xxx1'}});

        assert.strictEqual(cb_input_change_emit.callCount, 1);
        assert.strictEqual(cb_input_change_emit.getCall(0).args[0], 'xxx1');

        event.target.value = 'xxxxx'
        target.props.children[0].props.onClick(event);

        assert.strictEqual(event_target_select.callCount, 1);
        assert.strictEqual(event_target_select.getCall(0).args[0], 0);
        assert.strictEqual(event_target_select.getCall(0).args[1], 5);

        target.props.children[0].props.onMouseEnter({target:{value:'xxx2'}});

        assert.strictEqual(cb_input_mouse_enter_emit.callCount, 1);
        assert.strictEqual(cb_input_mouse_enter_emit.getCall(0).args.length, 0);

        target.props.children[1].props.onClick({target:{value:'xxx4'}});

        assert.strictEqual(cb_button_click_emit.callCount, 1);
        assert.strictEqual(cb_button_click_emit.getCall(0).args.length, 0);

        target.props.children[1].props.onMouseEnter({target:{value:'xxx5'}});

        assert.strictEqual(cb_button_mouse_enter_emit.callCount, 1);
        assert.strictEqual(cb_button_mouse_enter_emit.getCall(0).args.length, 0);

    });
});
