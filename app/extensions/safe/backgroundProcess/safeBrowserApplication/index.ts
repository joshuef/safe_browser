import {
    setSafeBrowserAppObject,
    getSafeBrowserAppObject
} from '$App/extensions/safe/backgroundProcess/safeBrowserApplication/theApplication';

import { logger } from '$Logger';

import { initAuthed } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAuthed';
import { initAnon } from '$Extensions/safe/backgroundProcess/safeBrowserApplication/init/initAnon';

let safeBrowserAppObject;

export const setupUnauthedConnection = (): void => {
    logger.verbose( 'Setting up unauthed connection' );

    // step one. Get app going.
    safeBrowserAppObject = initAnon();
    setSafeBrowserAppObject( safeBrowserAppObject );
};

export const setupAuthorisedConnection = (): void => {
    logger.verbose( 'Setting up unauthed connection' );

    // step one. Get app going.
    safeBrowserAppObject = initAuthed();
    setSafeBrowserAppObject( safeBrowserAppObject );
};
