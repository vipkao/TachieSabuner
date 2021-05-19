'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ツールチップを表示させる枠。
 */
class TooltipArea extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._Area_onMouseEnter = this._Area_onMouseEnter.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        //this.props.download_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        //this.props.download_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        return {
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    _Area_onMouseEnter(e){
        this.props.tooltip_action.show(this.props.tooltip_caption);
    }

    render(){
        return (<div
            onMouseEnter={this._Area_onMouseEnter}
        >
            {this.props.children}
        </div>);
    }
};
TooltipArea.propTypes = {
    tooltip_caption: PropTypes.string.isRequired, 
    tooltip_action:  PropTypes.object.isRequired,
};

export default TooltipArea;
