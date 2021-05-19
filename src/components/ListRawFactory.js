'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';
import TooltipArea from './TooltipArea';

/**
 * 選択状態文字列リストの生データを表示、編集するＵＩ群。
 */
 class ListRawFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this._Textarea_onChange = this._Textarea_onChange.bind(this);
        this._Textarea_onClick = this._Textarea_onClick.bind(this);
        this._Textarea_onMouseEnter = this._Textarea_onMouseEnter.bind(this);
        this._TagButton_onClick = this._TagButton_onClick.bind(this);
        this._TagButton_onMouseEnter = this._TagButton_onMouseEnter.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.raw_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.raw_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        return {
            raw_text: this.props.raw_store.getRaw(),
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    _Textarea_onChange(e){
        this.props.raw_action.update(e.target.value);
    }
    _Textarea_onClick(e){
        e.target.select(0, e.target.value.length);
    }
    _Textarea_onMouseEnter(e){
        this.props.tooltip_action.show('差分情報のリストがテキストになっています。コピペして保存できます。');
    }
    _TagButton_onClick(sender){
        var raws = this.props.raw_store.getRawByArray();
        this.props.list_action.clear();
        for(var raw of raws){
            this.props.list_action.addRaw(raw);
        }
        this.props.list_action.select(0);
    }
    _TagButton_onMouseEnter(sender){
        this.props.tooltip_action.show('テキストを差分情報のリストに登録します。');
    }

    render(){
        var raws = this.props.raw_store.getRawByArray();
        var maxcol = raws.reduce((prev, cur, index, array) => {
            if(prev == null){ return cur; }
            return (prev.length < cur.length ? cur : prev);
        }).length;
        return (<TooltipArea
            tooltip_caption="差分情報のリストデータを取り扱います。"
            tooltip_action={this.props.tooltip_action}
        >
            <textarea
                rows={raws.length+1}
                cols={maxcol}
                onChange={this._Textarea_onChange}
                onClick={this._Textarea_onClick}
                onMouseEnter={this._Textarea_onMouseEnter}
                value={this.state.raw_text}
            >{this.state.raw_text}</textarea><br/>
            <TagButton
                onClick={this._TagButton_onClick}
                onMouseEnter={this._TagButton_onMouseEnter}
            >リストに反映させる</TagButton>
        </TooltipArea>);
    }
};
ListRawFactory.propTypes = {
    raw_store:      PropTypes.object.isRequired,
    raw_action:     PropTypes.object.isRequired,
    list_action:    PropTypes.object.isRequired,
    tooltip_action: PropTypes.object.isRequired,
};

export default ListRawFactory;
