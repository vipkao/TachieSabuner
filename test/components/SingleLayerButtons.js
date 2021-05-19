'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import SingleLayerButtons from '../../src/components/SingleLayerButtons';

import TagButton from '../../src/components/TagButton';

describe('components/SingleLayerButtonsテスト', () => {
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
            <SingleLayerButtons
                caption={'test1'}
                layer_id={'test2'}
                images={[
                    {id: 'test3'}, 'br',
                    {id: 'test4'},
                ]}
                selected={'test4'}
                onClick={()=>{}}
                onMouseEnter={()=>{}}
                onMouseLeave={()=>{}}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <div><span className="caption">{'test1'}</span>：<br/><span>
                <TagButton
                    class_name={''}
                    sender={{id: 'test3'}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                    key={0}
                >
                    <span>{'test3'}</span>
                </TagButton>
                <br key={1}/>
                <TagButton
                    class_name={'selected'}
                    sender={{id: 'test4'}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                    key={2}
                >
                    <span>{'test4'}</span>
                </TagButton>
            </span></div>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const callback_click_emit = sinon.spy(callback_click, 'callback');
        const callback_mouseenter_emit = sinon.spy(callback_mouseenter, 'callback');
        const callback_mouseleave_emit = sinon.spy(callback_mouseleave, 'callback');

        renderer.render(
            <SingleLayerButtons
                caption={'test1'}
                layer_id={'test2'}
                images={[
                    {id: 'test3'}, 'br',
                    {id: 'test4'},
                ]}
                selected={'test4'}
                onClick={callback_click.callback}
                onMouseEnter={callback_mouseenter.callback}
                onMouseLeave={callback_mouseleave.callback}
            />
        );
        let target = renderer.getRenderOutput();

        target.props.children[3].props.children[0].props.onClick({id: 'xxx1'});

        assert.strictEqual(callback_click_emit.callCount, 1);
        assert.strictEqual(callback_click_emit.getCall(0).args[0], 'test2');
        assert.strictEqual(callback_click_emit.getCall(0).args[1], 'xxx1');


        target.props.children[3].props.children[0].props.onMouseEnter({id: 'xxx2'});

        assert.strictEqual(callback_mouseenter_emit.callCount, 1);
        assert.strictEqual(callback_mouseenter_emit.getCall(0).args[0], 'test2');
        assert.strictEqual(callback_mouseenter_emit.getCall(0).args[1], 'xxx2');


        target.props.children[3].props.children[0].props.onMouseLeave({id: 'xxx3'});

        assert.strictEqual(callback_mouseleave_emit.callCount, 1);
        assert.strictEqual(callback_mouseleave_emit.getCall(0).args[0], 'test2');
        assert.strictEqual(callback_mouseleave_emit.getCall(0).args[1], 'xxx3');
    });
});
