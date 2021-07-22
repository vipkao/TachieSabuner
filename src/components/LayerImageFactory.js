'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import LayerImage from './LayerImage';

/**
 * 立ち絵の切り替えに応じて、立ち絵のベース絵とパーツを表示する機能。
 */
class LayerImageFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.base_store.addListener(this._storeUpdate);
        this.props.appearance_store.addListener(this._storeUpdate);
        this.props.layer_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.base_store.removeListener(this._storeUpdate);
        this.props.appearance_store.removeListener(this._storeUpdate);
        this.props.layer_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        var base_state = this.props.base_store.getState();
        var layer_alias = this.props.base_store.getAlias();
        return {
            base_state: base_state,
            layer_alias: layer_alias,
            base_info: this.props.base_store.getInfo(base_state),
            layer_states: this.props.layer_store.getStateArray(),
            scale: this.props.appearance_store.getScale(),
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    render(){
        var base_image = <LayerImage
            path={this.props.path}
            base={this.state.base_state}
            layer=""
            suffix={this.state.base_info.suffix}
            builder={this.props.path_builder}
            top={0}
            left={0}
            class_name="image"
        />;
        var i = 0;
        var layer_base = this.state.layer_alias == "" ? this.state.base_state : this.state.layer_alias;
        var layer_images = this.state.layer_states.map((state)=>{
            return (<LayerImage
                path={this.props.path}
                base={layer_base}
                layer={state.state}
                suffix={state.info.suffix}
                builder={this.props.path_builder}
                top={state.info.top}
                left={state.info.left}
                class_name="image"
                key={i++}
            />);
        });
        var style = {
            transform: `scale(${this.state.scale},${this.state.scale})`,
            margin: "0 auto",
            position: "relative",
            width: `${this.state.base_info.width}px`,
        };
        return (<div style={style}>{base_image}{layer_images}</div>);
    }
};
LayerImageFactory.propTypes = {
    path:               PropTypes.string.isRequired,
    path_builder:       PropTypes.object.isRequired,
    base_store:         PropTypes.object.isRequired,
    layer_store:        PropTypes.object.isRequired,
    appearance_store:   PropTypes.object.isRequired,
};

export default LayerImageFactory;
