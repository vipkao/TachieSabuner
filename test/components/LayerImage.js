'use strict';

import assert from 'assert';
import sinon from 'sinon';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import expect from 'expect';
import expect_jsx from 'expect-jsx';
expect.extend(expect_jsx);

import LayerImage from '../../src/components/LayerImage';
import PathBuilder from '../../src/utils/ImagePathBuilder/AllJoin';

describe('components/LayerImageテスト', () => {
    let renderer;

    beforeEach(() => {
        renderer = new ShallowRenderer();
    });
    it('正しくレンダリングされているか。', () => {
        renderer.render(
            <LayerImage
                path={'test1'}
                base={'test2'}
                layer={'test3'}
                suffix={'test4'}
                builder={new PathBuilder()}
                top={100}
                left={200}
                class_name={'test5'}
            />
        );
        let actual = renderer.getRenderOutput();

        let expected = (
            <img
                src={'test1test2test3.test4'}
                style={{
                    position: 'absolumte',
                    top: 100,
                    left: 200,
                }}
                className={'test5'}
            />
        );

        expect(actual).toEqualJSX(expected);
    });
});
