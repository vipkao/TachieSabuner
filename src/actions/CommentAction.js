'use strict';

import CommentConstants from './CommentConstants';

const CommentAction = function(dispatcher){
    this.change = function(comment){
        dispatcher.dispatch({
            action_type: CommentConstants.CHANGE,
            comment: comment,
        });
    };
};
export default CommentAction;
