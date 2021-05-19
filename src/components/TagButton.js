'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * 文字付きのボタンを提供するＵＩ。
 */
class TagButton extends React.Component {
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
    };    

    _onClick(e){
        this.props.onClick(this.props.sender);
    }
    _onMouseEnter(e){
        this.props.onMouseEnter(this.props.sender);
    }
    _onMouseLeave(e){
        this.props.onMouseLeave(this.props.sender);
    }
    render(){
        return (<button
            className={this.props.class_name}
            onClick={this._onClick}
            onMouseEnter={this._onMouseEnter}
            onMouseLeave={this._onMouseLeave}
        >
            {this.props.children}
        </button>);
    }
};
TagButton.propTypes = {
    class_name:     PropTypes.string,
    sender:         PropTypes.object,
    onClick:        PropTypes.func, //(sender)
    onMouseEnter:   PropTypes.func, //(sender)
    onMouseLeave:   PropTypes.func, //(sender)
}
TagButton.defaultProps = {
    class_name: '',
    sender: {},
    onClick: function(){},
    onMouseEnter: function(){},
    onMouseLeave: function(){},
};

export default TagButton;
