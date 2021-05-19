'use strict';

import assert from 'assert';
import sinon from 'sinon';

import TabPaneAction from '../../src/actions/TabPaneAction';
import TabPaneConstants from '../../src/actions/TabPaneConstants';

describe('actions/TabPaneActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new TabPaneAction(dispatcher);
    });
    it('change', () => {
        action.change('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, TabPaneConstants.CHANGE);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].pane_id, 'xxx');
    });
});
