import {
    setSafeBrowserAppObject,
    getSafeBrowserAppObject,
    safeIsAuthorised
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

import { logger } from '$Logger';

import { initAuthed } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';
import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';

export const setupUnauthedConnection = async (): Promise<void> => {
    logger.verbose( 'Setting up unauthed connection' );

    const safe = await initAnon();
    setSafeBrowserAppObject( safe );
};

export const setupAuthorisedConnection = async (): Promise<void> => {
    logger.verbose( 'Setting up authorised connection' );

    const safe = await initAuthed();
    const isAuthed = true;
    setSafeBrowserAppObject( safe, isAuthed );
};

export const registerNrsNameOnNetwork = async ( address ): Promise<void> => {
    logger.verbose( 'Attempting to register NRS Name', address );

    if ( !safeIsAuthorised() ) await setupAuthorisedConnection();

    const safe = await getSafeBrowserAppObject();

    // First we need some data to put on it... so we'll link to immutable placeholder..

    try {
        logger.verbose( 'Putting PublishedImmutableData...' );
        const buffer = Buffer.from( 'Placeholder for our NRS Map...x', 'utf-8' );

        console.log( 'BUFFEr', buffer );
        const idUrl = safe.files_put_published_immutable( buffer.buffer );
        const nrsMapData = safe.nrs_map_container_create(
            address,
            idUrl,
            true,
            true,
            false
        );
        logger.info( 'NRS Map Container created: ', nrsMapData );
    } catch ( error ) {
        logger.error( error );
    }
};
