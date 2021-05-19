'use strict';

import assert from 'assert';
import sinon from 'sinon';

import SelectAction from '../../src/actions/SelectAction';
import SelectConstants from '../../src/actions/SelectConstants';

describe('actions/SelectActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new SelectAction(dispatcher);
    });
    it('select', () => {
        action.select('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, SelectConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].selected, 'xxx');
    });
    it('enter', () => {
        action.enter()

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, SelectConstants.ENTER);
    });
});
