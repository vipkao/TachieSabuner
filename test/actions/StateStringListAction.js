'use strict';

import assert from 'assert';
import sinon from 'sinon';

import StateStringListAction from '../../src/actions/StateStringListAction';
import StateStringListConstants from '../../src/actions/StateStringListConstants';

describe('actions/StateStringListActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new StateStringListAction(dispatcher);
    });
    it('add', () => {
        action.add('xxx', 'yyy')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.ADD);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].comment, 'xxx');
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].state_string, 'yyy');
    });
    it('addRaw', () => {
        action.addRaw('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.ADD_RAW);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].raw, 'xxx');
    });
    it('remove', () => {
        action.remove()

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.REMOVE);
    });
    it('up', () => {
        action.up()

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.UP);
    });
    it('down', () => {
        action.down()

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.DOWN);
    });
    it('select', () => {
        action.select('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].index, 'xxx');
    });
    it('unselect', () => {
        action.unselect()

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.UNSELECT);
    });
    it('clear', () => {
        action.clear()

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, StateStringListConstants.CLEAR);
    });
});
