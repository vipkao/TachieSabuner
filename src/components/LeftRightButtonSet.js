'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';

/**
 * 立ち絵のパーツで、左右別に設定できるパーツ１つのボタン群。
 */
class LeftRightButtonSet extends React.Component {
    constructor(props) {
        super(props);
        this._TagButton_onClick = this._TagButton_onClick.bind(this);
        this._TagButton_onMouseEnter = this._TagButton_onMouseEnter.bind(this);
        this._TagButton_onMouseLeave = this._TagButton_onMouseLeave.bind(this);
    };    
    _TagButton_onClick(sender){
        this.props.onClick(sender.id, sender.pos);
    }
    _TagButton_onMouseEnter(sender){
        this.props.onMouseEnter(sender.id, sender.pos);
    }
    _TagButton_onMouseLeave(sender){
        this.props.onMouseLeave(sender.id, sender.pos);
    }

    render(){
        var left = this.props.left_selected  ? this.props.selected_class : "";
        var right = this.props.right_selected ? this.props.selected_class : "";
        var both = this.props.left_selected || this.props.right_selected ? this.props.selected_class : "";
        return (<span style={{display: "inline-block"}}>
            <TagButton
                class_name={both}
                sender={{id: this.props.parts_id, pos: 'both'}}
                onClick={this._TagButton_onClick}
                onMouseEnter={this._TagButton_onMouseEnter}
                onMouseLeave={this._TagButton_onMouseLeave}
            >{this.props.children}</TagButton>
            <TagButton
                class_name={left}
                sender={{id: this.props.parts_id, pos: 'left'}}
                onClick={this._TagButton_onClick}
                onMouseEnter={this._TagButton_onMouseEnter}
                onMouseLeave={this._TagButton_onMouseLeave}
            >o</TagButton>
            <TagButton
                class_name={right}
                sender={{id: this.props.parts_id, pos: 'right'}}
                onClick={this._TagButton_onClick}
                onMouseEnter={this._TagButton_onMouseEnter}
                onMouseLeave={this._TagButton_onMouseLeave}
            >o</TagButton>　
        </span>);
    }
};
LeftRightButtonSet.propTypes = {
    selected_class: PropTypes.string.isRequired,
    left_selected:  PropTypes.bool.isRequired,
    right_selected: PropTypes.bool.isRequired,
    parts_id:       PropTypes.string.isRequired,
    onClick:        PropTypes.func, //(parts_id, pos)
    onMouseEnter:   PropTypes.func, //(parts_id, pos)
    onMouseLeave:   PropTypes.func, //(parts_id, pos)
};
LeftRightButtonSet.defaultProps = {
    onClick: function(){},
    onMouseEnter: function(){},
    onMouseLeave: function(){},
};

export default LeftRightButtonSet;
