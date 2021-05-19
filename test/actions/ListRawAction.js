'use strict';

import assert from 'assert';
import sinon from 'sinon';

import ListRawAction from '../../src/actions/ListRawAction';
import ListRawConstants from '../../src/actions/ListRawConstants';

describe('actions/ListRawActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new ListRawAction(dispatcher);
    });
    it('update', () => {
        action.update('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, ListRawConstants.UPDATE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].raw, 'xxx');
    });
});
