import thunk from 'redux-thunk';
import { inRendererProcess } from '@Constants';
import promiseMiddleware from 'redux-promise';

import { forwardToRenderer, forwardToMain, triggerAlias } from 'electron-redux';

const addMiddlewares = ( middleware, isBackgroundProcess = false ) => 
{
    middleware.push( thunk );

    middleware.unshift( promiseMiddleware );

    if ( isBackgroundProcess )
    {
        middleware.push( triggerAlias );
    }

    if ( inRendererProcess )
    {
        // must be first
        middleware.unshift( forwardToMain );
    }

    if ( !inRendererProcess )
    {
        // must be last
        middleware.push( forwardToRenderer );
    }
};

export default addMiddlewares;
