'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';
import StateString from './StateString';

/**
 * 選択状態文字列に関するＵＩ群。
 */
 class StateStringFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this._StateString_onInputChange = this._StateString_onInputChange.bind(this);
        this._StateString_onInputMouseEnter = this._StateString_onInputMouseEnter.bind(this);
        this._StateString_onButtonClick = this._StateString_onButtonClick.bind(this);
        this._StateString_onButtonMouseEnter = this._StateString_onButtonMouseEnter.bind(this);
        this._Comment_onChange = this._Comment_onChange.bind(this);
        this._Comment_onMouseEnter = this._Comment_onMouseEnter.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.text_store.addListener(this._storeUpdate);
        this.props.comment_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.text_store.removeListener(this._storeUpdate);
        this.props.comment_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        return {
            state_string: this.props.text_store.getStateString(),
            comment: this.props.comment_store.getComment(),
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    _StateString_onInputChange(text){
        this.props.text_action.editingString(text);
    }
    _StateString_onInputMouseEnter(){
        this.props.tooltip_action.show('現在の差分情報がテキストになっています。コピペしたり編集できます。');
    }
    _StateString_onButtonClick(){
        var state = this.props.text_store.getStateString();
        this.props.state_string_action.updateString(state);
    }
    _StateString_onButtonMouseEnter(){
        this.props.tooltip_action.show('差分情報のテキストを実際の表示に反映させます。');
    }
    _Comment_onChange(text){
        this.props.comment_action.change(text);
    }
    _Comment_onMouseEnter(){
        this.props.tooltip_action.show('差分情報に分かりやすいコメントを付けることができます。');
    }
    render(){
        return (<div>
            <Comment
                comment={this.state.comment}
                onChange={this._Comment_onChange}
                onMouseEnter={this._Comment_onMouseEnter}
            />
            <StateString
                state_string={this.state.state_string}
                onInputChange={this._StateString_onInputChange}
                onInputMouseEnter={this._StateString_onInputMouseEnter}
                onButtonClick={this._StateString_onButtonClick}
                onButtonMouseEnter={this._StateString_onButtonMouseEnter}
            >表示に反映</StateString>
        </div>);
    }
};
StateStringFactory.propTypes = {
    text_store:             PropTypes.object.isRequired,
    text_action:            PropTypes.object.isRequired,
    comment_store:          PropTypes.object.isRequired,
    comment_action:         PropTypes.object.isRequired,
    state_string_action:    PropTypes.object.isRequired,
    tooltip_action:         PropTypes.object.isRequired,
};

export default StateStringFactory;
