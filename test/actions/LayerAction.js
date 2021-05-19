'use strict';

import assert from 'assert';
import sinon from 'sinon';

import LayerAction from '../../src/actions/LayerAction';
import LayerConstants from '../../src/actions/LayerConstants';

describe('actions/LayerActionテスト', () => {
    let dispatcher;
    let dispatcher_dispatch;
    let action;

    beforeEach(() => {
        dispatcher = {dispatch(){}};
        dispatcher_dispatch = sinon.spy(dispatcher, 'dispatch');
        action = new LayerAction(dispatcher);
    });
    it('select', () => {
        action.select('xxx', 'yyy')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, LayerConstants.SELECT);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].layer_id, 'xxx');
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].parts_id, 'yyy');
    });
    it('startPreview', () => {
        action.startPreview('xxx', 'yyy')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, LayerConstants.START_PREVIEW);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].layer_id, 'xxx');
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].parts_id, 'yyy');
    });
    it('endPreview', () => {
        action.endPreview('xxx')

        assert.strictEqual(dispatcher_dispatch.callCount, 1);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].action_type, LayerConstants.END_PREVIEW);
        assert.strictEqual(dispatcher_dispatch.getCall(0).args[0].layer_id, 'xxx');
    });
});
