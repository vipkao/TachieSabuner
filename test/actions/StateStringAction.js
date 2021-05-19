'use strict';

import assert from 'assert';
import sinon from 'sinon';

import StateStringAction from '../../src/actions/StateStringAction';
import StateStringConstants from '../../src/actions/StateStringConstants';

describe('actions/StateStringActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new StateStringAction(dispatcher);
    });
    it('updateBase', () => {
        action.updateBase('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringConstants.UPDATE_BASE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].state_string, 'xxx');
    });
    it('updateLayer', () => {
        action.updateLayer('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringConstants.UPDATE_LAYER);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].state_string, 'xxx');
    });
    it('updateString', () => {
        action.updateString('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringConstants.UPDATE_STRING);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].state_string, 'xxx');
    });
    it('editingString', () => {
        action.editingString('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringConstants.EDITING_STRING);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].state_string, 'xxx');
    });
});
