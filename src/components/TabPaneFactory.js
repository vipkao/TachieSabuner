'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';

/**
 * タブ機能を提供するＵＩ群。
 */
class TabPaneFactory extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this._TagButton_onClick = this._TagButton_onClick.bind(this);
        this._TagButton_onMouseEnter = this._TagButton_onMouseEnter.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.pane_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.pane_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        var active_id = this.props.pane_store.getActivePaneId();
        var active_component = null;
        var pane_infos = this.props.pane_store.getPaneInfos().map((info) => {
            if(typeof info === 'string'){
                return info;
            }
            if(active_id === info.id){
                active_component = this.props.pane_components[info.id];
            }
            return {
                id: info.id,
                caption: info.caption,
                active: (active_id === info.id),
                tooltip: info.tooltip,
            };
        });
        return {
            pane_infos: pane_infos,
            active_component: active_component,
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    _TagButton_onClick(sender){
        this.props.pane_action.change(sender.id);
    }
    _TagButton_onMouseEnter(sender){
        this.props.tooltip_action.show(sender.tooltip);
    }
    render(){
        var buttons = this.state.pane_infos.map((pane, index) => {
            if(typeof pane === 'string'){
                if(pane.toLowerCase() === 'br'){
                    return (<br key={index}/>);
                }
                throw new Error('['+pane+'] is illigal pane type.');
            }

            return (<TagButton
                class_name={pane.active ? "selected" : ""}
                sender={{id: pane.id, tooltip: pane.tooltip, }}
                key={index}
                onClick={this._TagButton_onClick}
                onMouseEnter={this._TagButton_onMouseEnter}
            >{pane.caption}</TagButton>);
        });
        return (<div>
            <span>{this.props.caption}</span>
            <div>{buttons}</div>
            <hr/>
            {this.state.active_component}
        </div>);
    }
};
TabPaneFactory.propTypes = {
    caption:            PropTypes.string,
    pane_store:         PropTypes.object.isRequired,
    pane_action:        PropTypes.object.isRequired,
    pane_components:    PropTypes.array.isRequired,
    tooltip_action:     PropTypes.object.isRequired,
};

export default TabPaneFactory;
