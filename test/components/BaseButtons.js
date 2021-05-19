'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import BaseButtons from '../../src/components/BaseButtons';
import TagButton from '../../src/components/TagButton';

describe('components/BaseButtonsテスト', () => {
    let renderer;
    let callback;

    beforeEach(() => {
        renderer = new ShallowRenderer();
        callback = {callback(){}};
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <BaseButtons
                bases={[
                    {id: 'test1', caption: 'test1cap', },
                    {id: 'test2',  },
                ]}
                selected={'test2'}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (<div>
            <span className="caption">立ち絵種類</span>：<br/>
            <span>
                <TagButton
                    class_name={''}
                    sender={{id: 'test1'}}
                    key={0}
                >
                    {'test1cap'}
                </TagButton>
                <TagButton
                    class_name={'selected'}
                    sender={{id: 'test2'}}
                    key={1}
                >
                    {'test2'}
                </TagButton>
            </span>
        </div>);

        expect(actual).toEqualJSX(expected);
    });
    it('イベントが正しく伝わっているか。', () => {
        const callback_emit = sinon.spy(callback, 'callback');

        renderer.render(
            <BaseButtons
                bases={[
                    {id: 'test1', caption: 'test1cap', },
                    {id: 'test2',  },
                ]}
                selected={'test2'}
                onSelect={callback.callback}
            />
        );
        const target = renderer.getRenderOutput();
        target.props.children[3].props.children[0].props.onClick({id: 'test3'});

        assert.strictEqual(callback_emit.callCount, 1);
        assert.strictEqual(callback_emit.getCall(0).args[0], 'test3');
    });
});
