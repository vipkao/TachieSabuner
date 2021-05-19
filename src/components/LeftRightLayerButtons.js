'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import LeftRightButtonSet from './LeftRightButtonSet';

/**
 * 立ち絵のパーツで、左右別に設定できるパーツセットのボタン群。
 */
class LeftRightLayerButtons extends React.Component {
    constructor(props) {
        super(props);
        this._LeftRightButtonSet_onClick = this._LeftRightButtonSet_onClick.bind(this);
        this._LeftRightButtonSet_onMouseEnter = this._LeftRightButtonSet_onMouseEnter.bind(this);
        this._LeftRightButtonSet_onMouseLeave = this._LeftRightButtonSet_onMouseLeave.bind(this);
    };    
    _LeftRightButtonSet_onClick(parts_id, pos){
        this.props.onClick(this.props.layer_id, parts_id, pos);
    }
    _LeftRightButtonSet_onMouseEnter(parts_id, pos){
        this.props.onMouseEnter(this.props.layer_id, parts_id, pos);
    }
    _LeftRightButtonSet_onMouseLeave(parts_id, pos){
        this.props.onMouseLeave(this.props.layer_id, parts_id, pos);
    }
    render(){
        var images = this.props.images.map((image, index)=>{
            if(typeof image === 'string'){
                if(image.toLowerCase() === 'br'){
                    return (<br key={index}/>);
                }
                throw new Error('['+image+'] is illigal image type.');
            }

            var left_selected = (this.props.selected.left === image.id);
            var right_selected = (this.props.selected.right === image.id);
            return (<LeftRightButtonSet
                selected_class="selected"
                left_selected={left_selected}
                right_selected={right_selected}
                parts_id={image.id}
                onClick={this._LeftRightButtonSet_onClick}
                onMouseEnter={this._LeftRightButtonSet_onMouseEnter}
                onMouseLeave={this._LeftRightButtonSet_onMouseLeave}
                key={index}
            >
                <span>{image.id}</span>
            </LeftRightButtonSet>);
        });
        return (<div><span className="caption">{this.props.caption}</span>：<br/><span>{images}</span></div>);
    }
};
LeftRightLayerButtons.propTypes = {
    caption:        PropTypes.string.isRequired,
    layer_id:       PropTypes.string.isRequired,
    images:         PropTypes.array.isRequired,
    selected:       PropTypes.object.isRequired,
    wrap_length:    PropTypes.number,
    onClick:        PropTypes.func, //(layer_id, parts_id, pos)
    onMouseEnter:   PropTypes.func, //(layer_id, parts_id, pos)
    onMouseLeave:   PropTypes.func, //(layer_id, parts_id, pos)
};
LeftRightLayerButtons.defaultProps = {
    wrap_length: 5,
    onClick: function(){},
    onMouseEnter: function(){},
    onMouseLeave: function(){},
};

export default LeftRightLayerButtons;
