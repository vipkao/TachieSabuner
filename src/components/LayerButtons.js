'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import SingleLayerButtons from './SingleLayerButtons';
import LeftRightLayerButtons from './LeftRightLayerButtons';

/**
 * 立ち絵の差分パーツを指定できるボタン群。
 */
class LayerButtons extends React.Component {
    constructor(props) {
        super(props);
        this._SingleLayerButtons_onClick = this._SingleLayerButtons_onClick.bind(this);
        this._SingleLayerButtons_onMouseEnter = this._SingleLayerButtons_onMouseEnter.bind(this);
        this._SingleLayerButtons_onMouseLeave = this._SingleLayerButtons_onMouseLeave.bind(this);
        this._LeftRightLayerButtons_onClick = this._LeftRightLayerButtons_onClick.bind(this);
        this._LeftRightLayerButtons_onMouseEnter = this._LeftRightLayerButtons_onMouseEnter.bind(this);
        this._LeftRightLayerButtons_onMouseLeave = this._LeftRightLayerButtons_onMouseLeave.bind(this);
    };    
    _SingleLayerButtons_onClick(layer_id, parts_id){
        this.props.onSelect(layer_id, parts_id);
    }
    _SingleLayerButtons_onMouseEnter(layer_id, parts_id){
        this.props.onStartPreview(layer_id, parts_id);
    }
    _SingleLayerButtons_onMouseLeave(layer_id, parts_id){
        this.props.onEndPreview(layer_id, parts_id);
    }
    _LeftRightLayerButtons_onClick(layer_id, parts_id, pos){
        this.props.onSelect(layer_id, parts_id + this._buildPosString(pos));
    }
    _LeftRightLayerButtons_onMouseEnter(layer_id, parts_id, pos){
        this.props.onStartPreview(layer_id, parts_id + this._buildPosString(pos));
    }
    _LeftRightLayerButtons_onMouseLeave(layer_id, parts_id, pos){
        this.props.onEndPreview(layer_id, parts_id + this._buildPosString(pos));
    }
    _buildPosString(pos){
        if(pos === 'both'){ return 'b'; }
        if(pos === 'left'){ return 'l'; }
        if(pos === 'right'){ return 'r'; }
        throw new Error('['+pos+'] is illigal pos.');
    }
    render(){
        var layers = this.props.layers.map((layer, index)=>{
            var key = index;
            var caption = (layer.caption ? layer.caption+'('+layer.id+')' : layer.id);
            if(layer.type === 'single'){
                return (<SingleLayerButtons
                    caption={caption}
                    layer_id={layer.id}
                    images={layer.images}
                    selected={this.props.selected[layer.id] ? this.props.selected[layer.id] : ""}
                    onClick={this._SingleLayerButtons_onClick}
                    onMouseEnter={this._SingleLayerButtons_onMouseEnter}
                    onMouseLeave={this._SingleLayerButtons_onMouseLeave}
                    key={index}
                />);
            }else if(layer.type === 'left-right'){
                return (<LeftRightLayerButtons
                    caption={caption}
                    layer_id={layer.id}
                    images={layer.images}
                    selected={this.props.selected[layer.id] ? this.props.selected[layer.id] : {}}
                    onClick={this._LeftRightLayerButtons_onClick}
                    onMouseEnter={this._LeftRightLayerButtons_onMouseEnter}
                    onMouseLeave={this._LeftRightLayerButtons_onMouseLeave}
                    key={index}
                />);
            }
        });
        return (<div>{layers}</div>);
    }
};
LayerButtons.propTypes = {
    layers:         PropTypes.array.isRequired,
    selected:       PropTypes.object.isRequired,

    onSelect:       PropTypes.func, //(layer_id, parts_id)
    onStartPreview: PropTypes.func, //(layer_id, parts_id)
    onEndPreview:   PropTypes.func, //(layer_id, parts_id)
};
LayerButtons.defaultProps = {
    onSelect: function(){},
    onStartPreview: function(){},
    onEndPreview: function(){},
};

export default LayerButtons;
