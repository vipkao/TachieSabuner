'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';

/**
 * 立ち絵のベース絵を選択させるためのボタン群。
 */
class BaseButtons extends React.Component {
    constructor(props) {
        super(props);
        this._TagButton_onClick = this._TagButton_onClick.bind(this);
    };
    _TagButton_onClick(sender){
        this.props.onSelect(sender.id);
    }
    render(){
        var bases = this.props.bases.map((base, index)=>{
            if(typeof base === 'string'){
                if(base.toLowerCase() === 'br'){
                    return (<br key={index}/>);
                }
                throw new Error('['+base+'] is illigal base type.');
            }

            var selected = (this.props.selected === base.id ? "selected" : "");
            var caption = (base.caption ? base.caption : base.id);
            return (<TagButton
                class_name={selected}
                sender={{id: base.id}}
                key={index}
                onClick={this._TagButton_onClick}
            >
                {caption}
            </TagButton>);
        });
        return (
            <div><span className="caption">立ち絵種類</span>：<br/><span>{bases}</span></div>
        );
    }
};
BaseButtons.propTypes = {
    bases:      PropTypes.array.isRequired,
    selected:   PropTypes.string.isRequired,
    onSelect:   PropTypes.func, //(base_id)
};
BaseButtons.defaultProps = {
    onSelect: function(){},
};

export default BaseButtons;
