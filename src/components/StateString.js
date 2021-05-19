'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';

/**
 * 選択状態文字列の表示と編集に関するＵＩ。
 */
 class StateString extends React.Component {
    constructor(props) {
        super(props);
        this._onInputChange = this._onInputChange.bind(this);
        this._onInputClick = this._onInputClick.bind(this);
        this._onInputMouseEnter = this._onInputMouseEnter.bind(this);
        this._onButtonClick = this._onButtonClick.bind(this);
        this._onButtonMouseEnter = this._onButtonMouseEnter.bind(this);
    };    

    _onInputChange(e){
        this.props.onInputChange(e.target.value);
    }
    _onInputClick(e){
        e.target.select(0, e.target.value.length);
    }
    _onInputMouseEnter(e){
        this.props.onInputMouseEnter();
    }
    _onButtonClick(sender){
        this.props.onButtonClick();
    }
    _onButtonMouseEnter(sender){
        this.props.onButtonMouseEnter();
    }
    render(){
        return (<span>
            <input type="text"
                value={this.props.state_string}
                onChange={this._onInputChange}
                onClick={this._onInputClick}
                onMouseEnter={this._onInputMouseEnter}
            />
            <TagButton
                onClick={this._onButtonClick}
                onMouseEnter={this._onButtonMouseEnter}
            >
                {this.props.children}
            </TagButton>
        </span>);
    }
};
StateString.propTypes = {
    state_string:       PropTypes.string.isRequired,
    onInputChange:      PropTypes.func, //(text)
    onInputMouseEnter:  PropTypes.func,
    onButtonClick:      PropTypes.func,
    onButtonMouseEnter: PropTypes.func,
};
StateString.defaultProps = {
    onInputChange: function(){},
    onInputMouseEnter: function(){},
    onButtonClick: function(){},
    onButtonMouseEnter: function(){},
};

export default StateString;
