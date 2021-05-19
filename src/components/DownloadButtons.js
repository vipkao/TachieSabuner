'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import TagButton from './TagButton';
import TooltipArea from './TooltipArea';

/**
 * 立ち絵の画像をダウンロードするためのＵＩ群。
 */
class DownloadButtons extends React.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this._buildState = this._buildState.bind(this);
        this._storeUpdate = this._storeUpdate.bind(this);
        this._FaceDownload_onClick = this._FaceDownload_onClick.bind(this);
        this._FaceDownload_onMouseEnter = this._FaceDownload_onMouseEnter.bind(this);
        this._FullDownload_onClick = this._FullDownload_onClick.bind(this);
        this._FullDownload_onMouseEnter = this._FullDownload_onMouseEnter.bind(this);
        this._BaseDownload_onClick = this._BaseDownload_onClick.bind(this);
        this._BaseDownload_onMouseEnter = this._BaseDownload_onMouseEnter.bind(this);
        this.state = this._buildState();
    }    
    componentDidMount(){
        this.props.download_store.addListener(this._storeUpdate);
    }
    componentWillUnmount(){
        this.props.download_store.removeListener(this._storeUpdate);
    }
    _buildState(){
        return {
            code: this.props.download_store.getCode(),
        };
    }
    _storeUpdate(){
        this.setState(this._buildState());
    }
    _FaceDownload_onClick(e){
        this.props.download_action.face();
    }
    _FaceDownload_onMouseEnter(e){
        this.props.tooltip_action.show('差分とベースを合成した、顔部分の画像をダウンロードします。');
    }
    _FullDownload_onClick(sender){
        this.props.download_action.full();
    }
    _FullDownload_onMouseEnter(sender){
        this.props.tooltip_action.show('差分とベースを合成した、全身の画像をダウンロードします。');
    }
    _BaseDownload_onClick(e){
        this.props.download_action.base();
    }
    _BaseDownload_onMouseEnter(e){
        this.props.tooltip_action.show('ベースのみの画像をダウンロードします。');
    }

    render(){

        var downloadLink = (null);        
        var canvas = this.props.download_store.getCanvas();
        if(canvas != null){
            var src = canvas.toDataURL();
            var id = "download" + this.state.code;
            var downloadName = this.props.download_store.getFileName();
            downloadLink = (
                <div>
                <a id={id} download={downloadName} href={src}>ダウンロード({downloadName})</a>
                </div>
            );                
        }

        return (<TooltipArea
            tooltip_caption="立ち絵をダウンロードします。"
            tooltip_action={this.props.tooltip_action}
        >
            顔部分のみ：
            <TagButton
                onClick={this._FaceDownload_onClick}
                onMouseEnter={this._FaceDownload_onMouseEnter}
            >ダウンロードリンクを生成</TagButton><br/>
            全身：
            <TagButton
                onClick={this._FullDownload_onClick}
                onMouseEnter={this._FullDownload_onMouseEnter}
            >ダウンロードリンクを生成</TagButton><br/>
            ベースのみ：
            <TagButton
                onClick={this._BaseDownload_onClick}
                onMouseEnter={this._BaseDownload_onMouseEnter}
            >ダウンロードリンクを生成</TagButton><br/>
            {downloadLink}
        </TooltipArea>);
    }
};
DownloadButtons.propTypes = {
    download_store:     PropTypes.object.isRequired,
    download_action: PropTypes.object.isRequired,
    tooltip_action: PropTypes.object.isRequired,
};

export default DownloadButtons;
