'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * 立ち絵の表示サイズに関するＵＩ。
 */
class ScaleList extends React.Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    };    
    _onChange(e){
        var index = parseInt(e.target.value, 10);
        this.props.onSelect(index);
    }
    render(){
        var options = this.props.scales.map((caption, index)=>{
            return (<option value={index} key={index}>{caption}</option>);
        });
        return (
            <div>
                表示サイズ：
                <select onChange={this._onChange} value={this.props.selected}>{options}</select>
            </div>
        );
    }
};
ScaleList.propTypes = {
    scales:         PropTypes.array.isRequired,
    selected:       PropTypes.number.isRequired,
    onSelect:       PropTypes.func, //(index)
};
ScaleList.defaultProps = {
    onSelect: function(){},
};

export default ScaleList;
