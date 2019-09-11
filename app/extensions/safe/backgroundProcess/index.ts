import { Store } from 'redux';
import { logger } from '$Logger';

import { blockNonSAFERequests } from '$Extensions/safe/blockNonSafeReqs';
import { registerSafeProtocol } from '$Extensions/safe/protocols/safe';

import { connectUnauthorised } from '$Extensions/safe/actions/aliased';

export {
    getHTTPFriendlyData
} from '$App/extensions/safe/backgroundProcess/fetch';

export const onInitBgProcess = async ( store: Store ): Promise<void> => {
    logger.info( 'Registering SAFE Network Protocols' );
    try {
        registerSafeProtocol();
        blockNonSAFERequests();

        store.dispatch( connectUnauthorised() );
    } catch ( e ) {
        logger.error( 'Load extensions error: ', e );
    }

    // store.subscribe( () => {
    //     handleSafeBrowserStoreChanges( store );
    // } );
};
