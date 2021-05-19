'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';

/**
 * 選択状態文字列のリストの表示と編集に関するＵＩ群。
 */
class StateStringListFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this._TagButton_add_onClick = this._TagButton_add_onClick.bind(this);
        this._TagButton_add_onMouseEnter = this._TagButton_add_onMouseEnter.bind(this);
        this._TagButton_remove_onClick = this._TagButton_remove_onClick.bind(this);
        this._TagButton_remove_onMouseEnter = this._TagButton_remove_onMouseEnter.bind(this);
        this._TagButton_up_onClick = this._TagButton_up_onClick.bind(this);
        this._TagButton_up_onMouseEnter = this._TagButton_up_onMouseEnter.bind(this);
        this._TagButton_down_onClick = this._TagButton_down_onClick.bind(this);
        this._TagButton_down_onMouseEnter = this._TagButton_down_onMouseEnter.bind(this);
        this._Select_onChange = this._Select_onChange.bind(this);
        this._Select_onMouseEnter = this._Select_onMouseEnter.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.list_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.list_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        var state_strings = this.props.list_store.getRawStrings();
        var selected = this.props.list_store.isSelected() ? this.props.list_store.getIndex() : '';
        return {
            state_strings: state_strings,
            selected_index: selected,
            length: state_strings.length,
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    _TagButton_add_onClick(){
        this.props.list_action.add(
            this.props.comment_store.getComment()
            ,this.props.state_store.getStateString()
        );
    }
    _TagButton_add_onMouseEnter(){
        this.props.tooltip_action.show('現在の差分情報をリストに追加します。');
    }
    _TagButton_remove_onClick(){
        this.props.list_action.remove();
    }
    _TagButton_remove_onMouseEnter(){
        this.props.tooltip_action.show('選択中の差分情報をリストから削除します。');
    }
    _TagButton_up_onClick(){
        this.props.list_action.up();
    }
    _TagButton_up_onMouseEnter(){
        this.props.tooltip_action.show('選択中の差分情報の順番を入れ替えます。');
    }
    _TagButton_down_onClick(){
        this.props.list_action.down();
    }
    _TagButton_down_onMouseEnter(){
        this.props.tooltip_action.show('選択中の差分情報の順番を入れ替えます。');
    }
    _Select_onChange(e){
        this.props.list_action.select(e.target.value);
    }
    _Select_onMouseEnter(){
        this.props.tooltip_action.show('リストの差分情報を選択してください。表示に反映されます。');
    }
    render(){
        var i = 0;
        var options = this.state.state_strings.map((state, index)=>{
            return (<option
                value={index}
                key={index}
            >{state}</option>);
        });

        return (<div>
            <TagButton
                onClick={this._TagButton_add_onClick}
                onMouseEnter={this._TagButton_add_onMouseEnter}
            >リストに追加</TagButton>
            <TagButton
                onClick={this._TagButton_remove_onClick}
                onMouseEnter={this._TagButton_remove_onMouseEnter}
            >リストから削除</TagButton>
            <TagButton
                onClick={this._TagButton_up_onClick}
                onMouseEnter={this._TagButton_up_onMouseEnter}
            >上げる</TagButton>
            <TagButton
                onClick={this._TagButton_down_onClick}
                onMouseEnter={this._TagButton_down_onMouseEnter}
            >下げる</TagButton>
            <br/>
            <select
                size={this.state.length > 10 ? 10 : this.state.length}
                value={this.state.selected_index}
                onChange={this._Select_onChange}
                onMouseEnter={this._Select_onMouseEnter}
            >
                {options}
            </select>
        </div>);
    }
};
StateStringListFactory.propTypes = {
    list_store:     PropTypes.object.isRequired,
    list_action:    PropTypes.object.isRequired,
    state_store:    PropTypes.object.isRequired,
    comment_store:  PropTypes.object.isRequired,
    state_action:   PropTypes.object.isRequired,
    tooltip_action: PropTypes.object.isRequired,
};

export default StateStringListFactory;
