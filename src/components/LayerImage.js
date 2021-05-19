'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * 立ち絵のベース絵やパーツを実際に表示させるＵＩ。
 */
class LayerImage extends React.Component {
    constructor(props) {
        super(props);
    };    
    render(){
        var style = {
            position: 'absolumte',
            top: this.props.top,
            left: this.props.left,
        };
        var file = this.props.builder.build(
            this.props.path,
            this.props.base,
            this.props.layer,
            this.props.suffix
        );
        return (<img src={file} style={style} className={this.props.class_name}/>);
    }
};
LayerImage.propTypes = {
    path:       PropTypes.string.isRequired,
    base:       PropTypes.string.isRequired,
    layer:      PropTypes.string.isRequired,
    suffix:     PropTypes.string.isRequired,
    builder:    PropTypes.object.isRequired,
    top:        PropTypes.number,
    left:       PropTypes.number,
    class_name: PropTypes.string.isRequired,
};
LayerImage.defaultProps = {
    top: 0,
    left: 0,
};

export default LayerImage;
