'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * 立ち絵セットに付けるコメントを入力するＵＩ。
 */
class Comment extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
    };    
    _onChange(e){
        this.props.onChange(e.target.value);
    }
    _onClick(e){
        e.target.select(0, e.target.value.length);
    }
    _onMouseEnter(e){
        this.props.onMouseEnter();
    }
    render(){
        return (<input type="text"
            size={5}
            value={this.props.comment}
            className={this.props.class_name}
            onChange={this._onChange}
            onClick={this._onClick}
            onMouseEnter={this._onMouseEnter}
        />);
    }
};
Comment.propTypes = {
    comment:        PropTypes.string.isRequired,
    class_name:     PropTypes.string,
    onChange:       PropTypes.func, //(text)
    onMouseEnter:   PropTypes.func,
};
Comment.defaultProps = {
    class_name: '',
    onChange: function(){},
    onMouseEnter: function(){},
};

export default Comment;
