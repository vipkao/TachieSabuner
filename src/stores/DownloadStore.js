'use strict';

import Observer from '../utils/Observer';

import DownloadConstants      from '../actions/DownloadConstants';

/**
 * ダウンロード処理に関する状態を保持する。
 */
const DownloadStore = function(dispatcher){
    var _this = this;

    function _onDownloadEvent(payload){
        if(payload.action_type === DownloadConstants.FACE){
            _code = Date.now();
            _canvas = payload.canvas;
            _fileName = payload.fileName;
            _raiseEvent();
        }
        if(payload.action_type === DownloadConstants.BASE){
            _code = Date.now();
            _canvas = payload.canvas;
            _fileName = payload.fileName;
            _raiseEvent();
        }
        if(payload.action_type === DownloadConstants.FULL){
            _code = Date.now();
            _canvas = payload.canvas;
            _fileName = payload.fileName;
            _raiseEvent();
        }
    }

    //ダウンロード用コードを取得する。
    this.getCode = function(){
        return _code;
    }

    //ダウンロードする画像が描かれたcanvasを取得する。
    this.getCanvas = function(){
        return _canvas;
    }

    //ダウンロードする画像のファイル名を取得する。
    this.getFileName = function(){
        return _fileName;
    }

    var _observer = new Observer();
    this.addListener = function(callback){ _observer.addListener(callback); };
    this.removeListener = function(callback){ _observer.removeListener(callback); };
    function _raiseEvent(data){ _observer.raiseEvent(data); }

    var _code = 0;
    var _canvas = null;
    var _fileName = "";

    dispatcher.addListener(_onDownloadEvent);

};
export default DownloadStore;
