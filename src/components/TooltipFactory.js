'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ツールチップの表示に関するＵＩ。
 */
class TooltipFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.tooltip_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.tooltip_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        return {
            message: this.props.tooltip_store.getMessage(),
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    render(){
        return (<span>[{this.state.message}]</span>);
    }
};
TooltipFactory.propTypes = {
    tooltip_store:  PropTypes.object.isRequired,
};

export default TooltipFactory;
