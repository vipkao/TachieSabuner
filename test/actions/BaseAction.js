'use strict';

import assert from 'assert';
import sinon from 'sinon';

import BaseAction from '../../src/actions/BaseAction';
import BaseConstants from '../../src/actions/BaseConstants';

describe('actions/BaseActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new BaseAction(dispatcher);
    });
    it('select', () => {
        action.select('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, BaseConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].id, 'xxx');
    });
});
