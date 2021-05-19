'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import BaseButtons from './BaseButtons';
import ScaleList from './ScaleList';
import LayerButtons from './LayerButtons';
import TooltipArea from './TooltipArea';

/**
 * 立ち絵の操作に関するＵＩ群。
 */
class ButtonFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this._ScaleList_onSelect = this._ScaleList_onSelect.bind(this);
        this._BaseButtons_onSelect = this._BaseButtons_onSelect.bind(this);
        this._LayerButtons_onSelect = this._LayerButtons_onSelect.bind(this);
        this._LayerButtons_onStartPreview = this._LayerButtons_onStartPreview.bind(this);
        this._LayerButtons_onEndPreview = this._LayerButtons_onEndPreview.bind(this);
        
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.appearance_store.addListener(this._storeUpdate);
        this.props.base_store.addListener(this._storeUpdate);
        this.props.layer_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.appearance_store.removeListener(this._storeUpdate);
        this.props.base_store.removeListener(this._storeUpdate);
        this.props.layer_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        return {
            scales: this.props.appearance_store.getScaleList(),
            scale_selected: this.props.appearance_store.getScaleIndex(),
            bases: this.props.base_store.getBases(),
            base_selected: this.props.base_store.getState(),
            layers: this.props.layer_store.getLayers(),
            layer_selected: this.props.layer_store.getState(),
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }

    _ScaleList_onSelect(index){
        this.props.appearance_action.scale(index);
    }
    _BaseButtons_onSelect(base_id){
        this.props.base_action.select(base_id);
    }
    _LayerButtons_onSelect(layer_id, parts_id){
        this.props.layer_action.select(layer_id, parts_id);
    }
    _LayerButtons_onStartPreview(layer_id, parts_id){
        this.props.layer_action.startPreview(layer_id, parts_id);
    }
    _LayerButtons_onEndPreview(layer_id, parts_id){
        this.props.layer_action.endPreview(layer_id);
    }
    render(){
        return (<TooltipArea
            tooltip_caption="差分を組み立てます。"
            tooltip_action={this.props.tooltip_action}
        >
            <ScaleList
                scales={this.state.scales}
                selected={this.state.scale_selected}
                onSelect={this._ScaleList_onSelect}
            />
            <BaseButtons
                bases={this.state.bases}
                selected={this.state.base_selected}
                onSelect={this._BaseButtons_onSelect}
            />
            <LayerButtons
                layers={this.state.layers}
                selected={this.state.layer_selected}
                onSelect={this._LayerButtons_onSelect}
                onStartPreview={this._LayerButtons_onStartPreview}
                onEndPreview={this._LayerButtons_onEndPreview}
            />
        </TooltipArea>);
    }
};
ButtonFactory.propTypes = {
    appearance_store:       PropTypes.object.isRequired,
    base_store:             PropTypes.object.isRequired,
    layer_store:            PropTypes.object.isRequired,
    appearance_action:      PropTypes.object.isRequired,
    base_action:            PropTypes.object.isRequired,
    layer_action:           PropTypes.object.isRequired,
    tooltip_action:         PropTypes.object.isRequired,
};

export default ButtonFactory;
