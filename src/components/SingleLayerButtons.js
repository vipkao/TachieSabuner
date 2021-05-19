'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';

/**
 * 立ち絵のパーツで、単体で設定されるパーツセットのボタン群。
 */
class SingleLayerButtons extends React.Component {
    constructor(props) {
        super(props);
        this._TagButton_onClick = this._TagButton_onClick.bind(this);
        this._TagButton_onMouseEnter = this._TagButton_onMouseEnter.bind(this);
        this._TagButton_onMouseLeave = this._TagButton_onMouseLeave.bind(this);
    };    

    _TagButton_onClick(sender){
        this.props.onClick(this.props.layer_id, sender.id);
    }
    _TagButton_onMouseEnter(sender){
        this.props.onMouseEnter(this.props.layer_id, sender.id);
    }
    _TagButton_onMouseLeave(sender){
        this.props.onMouseLeave(this.props.layer_id, sender.id);
    }
    render(){
        var images = this.props.images.map((image, index)=>{
            if(typeof image === 'string'){
                if(image.toLowerCase() === 'br'){
                    return (<br key={index}/>);
                }
                throw new Error('['+image+'] is illigal image type.');
            }
            var selected = (this.props.selected === image.id ? "selected" : "");
            return (<TagButton
                class_name={selected}
                sender={{id: image.id}}
                onClick={this._TagButton_onClick}
                onMouseEnter={this._TagButton_onMouseEnter}
                onMouseLeave={this._TagButton_onMouseLeave}
                key={index}
            >
                <span>{image.id}</span>
            </TagButton>);
        });
        return (<div><span className="caption">{this.props.caption}</span>：<br/><span>{images}</span></div>);
    }
};
SingleLayerButtons.propTypes = {
    caption:        PropTypes.string.isRequired,
    layer_id:       PropTypes.string.isRequired,
    images:         PropTypes.array.isRequired,
    selected:       PropTypes.string.isRequired,
    onClick:        PropTypes.func, //(layer_id, parts_id)
    onMouseEnter:   PropTypes.func, //(layer_id, parts_id)
    onMouseLeave:   PropTypes.func, //(layer_id, parts_id)
};
SingleLayerButtons.defaultProps = {
    wrap_length: 10,
    onClick: function(){},
    onMouseEnter: function(){},
    onMouseLeave: function(){},
};

export default SingleLayerButtons;
