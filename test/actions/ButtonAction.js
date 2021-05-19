'use strict';

import assert from 'assert';
import sinon from 'sinon';

import ButtonAction from '../../src/actions/ButtonAction';
import ButtonConstants from '../../src/actions/ButtonConstants';

describe('actions/ButtonActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new ButtonAction(dispatcher);
    });
    it('click', () => {
        action.click('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, ButtonConstants.CLICK);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].clicked, 'xxx');
    });
    it('enter', () => {
        action.enter('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, ButtonConstants.ENTER);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].entered, 'xxx');
    });
    it('leave', () => {
        action.leave('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, ButtonConstants.LEAVE);
    });
});
