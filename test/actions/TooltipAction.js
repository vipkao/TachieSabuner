'use strict';

import assert from 'assert';
import sinon from 'sinon';

import TooltipAction from '../../src/actions/TooltipAction';
import TooltipConstants from '../../src/actions/TooltipConstants';

describe('actions/TooltipActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new TooltipAction(dispatcher);
    });
    it('show', () => {
        action.show('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, TooltipConstants.SHOW);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].message, 'xxx');
    });
});
