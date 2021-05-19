'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import LayerButtons from '../../src/components/LayerButtons';
import SingleLayerButtons from '../../src/components/SingleLayerButtons';
import LeftRightLayerButtons from '../../src/components/LeftRightLayerButtons';

describe('components/LayerButtonsテスト', () => {
    let renderer;
    let callback_select;
    let callback_start_preview;
    let callback_end_preview;

    beforeEach(() => {
        renderer = new ShallowRenderer();
        callback_select = {callback(){}};
        callback_start_preview = {callback(){}};
        callback_end_preview = {callback(){}};
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <LayerButtons
                layers={[
                    {id: 'test1', caption: 'test2', type: 'single', images:[], },
                    {id: 'test3',                   type: 'left-right', images:[], },
                ]}
                selected={{test3: {left: 'a', right: 'b'}}}
                onSelect={()=>{}}
                onStartPreview={()=>{}}
                onEndPreview={()=>{}}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <div>
                <SingleLayerButtons
                    caption={'test2(test1)'}
                    layer_id={'test1'}
                    images={[]}
                    selected={''}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                    key={0}
                />
                <LeftRightLayerButtons
                    caption={'test3'}
                    layer_id={'test3'}
                    images={[]}
                    selected={{left: 'a', right: 'b'}}
                    onClick={()=>{}}
                    onMouseEnter={()=>{}}
                    onMouseLeave={()=>{}}
                    key={1}
                />
            </div>
        );

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const callback_select_emit = sinon.spy(callback_select, 'callback');
        const callback_start_preview_emit = sinon.spy(callback_start_preview, 'callback');
        const callback_end_preview_emit = sinon.spy(callback_end_preview, 'callback');

        renderer.render(
            <LayerButtons
                layers={[
                    {id: 'test1', caption: 'test2', type: 'single', images:[], },
                    {id: 'test3',                   type: 'left-right', images:[], },
                ]}
                selected={{test3: {left: 'a', right: 'b'}}}
                onSelect={callback_select.callback}
                onStartPreview={callback_start_preview.callback}
                onEndPreview={callback_end_preview.callback}
            />
        );
        let target = renderer.getRenderOutput();

        target.props.children[0].props.onClick('test3', 'test4');

        assert.strictEqual(callback_select_emit.callCount, 1);
        assert.strictEqual(callback_select_emit.getCall(0).args[0], 'test3');
        assert.strictEqual(callback_select_emit.getCall(0).args[1], 'test4');

        target.props.children[0].props.onMouseEnter('test4', 'test5');

        assert.strictEqual(callback_start_preview_emit.callCount, 1);
        assert.strictEqual(callback_start_preview_emit.getCall(0).args[0], 'test4');
        assert.strictEqual(callback_start_preview_emit.getCall(0).args[1], 'test5');

        target.props.children[0].props.onMouseLeave('test6', 'test7');

        assert.strictEqual(callback_end_preview_emit.callCount, 1);
        assert.strictEqual(callback_end_preview_emit.getCall(0).args[0], 'test6');
        assert.strictEqual(callback_end_preview_emit.getCall(0).args[1], 'test7');

        target.props.children[1].props.onClick('test3', 'test4', 'both');

        assert.strictEqual(callback_select_emit.callCount, 2);
        assert.strictEqual(callback_select_emit.getCall(1).args[0], 'test3');
        assert.strictEqual(callback_select_emit.getCall(1).args[1], 'test4b');

        target.props.children[1].props.onMouseEnter('test4', 'test5', 'left');

        assert.strictEqual(callback_start_preview_emit.callCount, 2);
        assert.strictEqual(callback_start_preview_emit.getCall(1).args[0], 'test4');
        assert.strictEqual(callback_start_preview_emit.getCall(1).args[1], 'test5l');

        target.props.children[1].props.onMouseLeave('test6', 'test7', 'right');

        assert.strictEqual(callback_end_preview_emit.callCount, 2);
        assert.strictEqual(callback_end_preview_emit.getCall(1).args[0], 'test6');
        assert.strictEqual(callback_end_preview_emit.getCall(1).args[1], 'test7r');

    });
});
