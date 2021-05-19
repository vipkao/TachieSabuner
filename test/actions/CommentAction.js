'use strict';

import assert from 'assert';
import sinon from 'sinon';

import CommentAction from '../../src/actions/CommentAction';
import CommentConstants from '../../src/actions/CommentConstants';

describe('actions/CommentActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new CommentAction(dispatcher);
    });
    it('change', () => {
        action.change('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, CommentConstants.CHANGE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].comment, 'xxx');
    });
});
