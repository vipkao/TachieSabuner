'use strict';

import Dispatcher from '../dispatcher/Dispatcher';

const DispatcherFactory = function(){
    this.create = function(){
        return new Dispatcher();
    };
};
export default DispatcherFactory;
