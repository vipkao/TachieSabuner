'use strict';

import DownloadConstants from './DownloadConstants';
import Canvas from 'canvas';

const DownloadAction = function(
    path,
    pathBuilder,
    base_store, layer_store, text_store,
    dispatcher
){
    function _promiseLoader(file){
        return new Promise(function(resolve){
            var img = new Image();
            img.onload = function(){
                resolve({
                    file: file,
                    image: img
                });
            };
            img.src = file.url;
        });
    }
    function _canvasBuilder(type, callback){
        var base_state = base_store.getState();
        var base = base_store.getInfo(base_state); 
        var layers = layer_store.getStateArray();

        var url = pathBuilder.build(
            path, base_state, "", base.suffix
        );    
        var baseFile = {
            index: 0,
            url: url,
            top: 0,
            left: 0,
        };
        var layerFiles = layers.map((layer, index)=>{
            var url = pathBuilder.build(
                path, base_state, layer.state, layer.info.suffix
            );    
            return {
                index: index + 1,
                url: url,
                top: layer.info.top,
                left: layer.info.left,
            };
        });

        var loaders = [];
        var fileName = "";
        if(type === DownloadConstants.FACE){
            loaders = layerFiles.map(f => _promiseLoader(f));
            loaders.push(_promiseLoader(baseFile));                
            fileName = text_store.getLayerString() + "." + base.suffix;
        }
        if(type === DownloadConstants.FULL){
            loaders = layerFiles.map(f => _promiseLoader(f));
            loaders.push(_promiseLoader(baseFile));                
            fileName = text_store.getStateString() + "." + base.suffix;
        }
        if(type === DownloadConstants.BASE){
            loaders.push(_promiseLoader(baseFile));            
            fileName = text_store.getBaseString() + "." + base.suffix;
        }

        Promise.all(loaders)
        .then(function(files){            
            var canvas = Canvas.createCanvas(base.width, base.height);
            var context = canvas.getContext('2d');
            files.sort((a,b) => {
                if(a.file.index < b.file.index){
                    return -1;
                }
                if(a.file.index > b.file.index){
                    return 1;
                }
                return 0;
            }).forEach(f => {
                context.drawImage(f.image, f.file.left, f.file.top);
            });

            if(type === DownloadConstants.FACE){
                var clip = Canvas.createCanvas(
                    base.download.face.width,
                    base.download.face.height
                );
                var clipContext = clip.getContext('2d');
                clipContext.drawImage(
                    canvas, 
                    -base.download.face.left,
                    -base.download.face.top
                );
                callback(clip, fileName);
                return;
            }

            callback(canvas, fileName);
        })
        .catch(error => {throw new Error(error);});

    }

    this.face = function(){
        _canvasBuilder(DownloadConstants.FACE, function(canvas, fileName){
            dispatcher.dispatch({
                action_type: DownloadConstants.FACE,
                fileName: fileName,
                canvas: canvas,
            });    
        });
    };
    this.full = function(){
        _canvasBuilder(DownloadConstants.FULL, function(canvas, fileName){
            dispatcher.dispatch({
                action_type: DownloadConstants.FULL,
                fileName: fileName,
                canvas: canvas,
            });    
        });
    };
    this.base = function(){
        _canvasBuilder(DownloadConstants.BASE, function(canvas, fileName){
            dispatcher.dispatch({
                action_type: DownloadConstants.BASE,
                fileName: fileName,
                canvas: canvas,
            });    
        });
    };
};
export default DownloadAction;
