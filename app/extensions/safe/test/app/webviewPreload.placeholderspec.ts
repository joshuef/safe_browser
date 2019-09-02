import * as webviewPreload from '$Extensions/safe/webviewPreload';
import { APP_INFO, startedRunningProduction } from '$Constants';

// avoid appveyour for its weak.ref issues right now.
const { APPVEYOR } = process.env;

// Some mocks to negate FFI and native libs we dont care about

//

describe( 'SAFE manageWebIdUpdates', () => {
    if ( APPVEYOR ) return;

    const win = {};
    // need to mock store. should be called once.
    const store = {
        subscribe: jest.fn(),
        getState: jest.fn( () => ( {
            safeBrowserApp: { experimentsEnabled: true }
        } ) )
    };

    beforeEach( () => {
    // webviewPreload.onPreload( store, win );
    } );

    test( 'webIdEventEmitter should not exist with experiments disabled', () => {
        const noExpStore = {
            subscribe: jest.fn(),
            getState: jest.fn( () => ( {
                safeBrowserApp: { experimentsEnabled: false }
            } ) )
        };

        // webviewPreload.onPreload( noExpStore, win );

        expect( win.webIdEventEmitter ).toBeNull();
    } );

    test( 'webIdEventEmitter should exist', () => {
        expect( win.webIdEventEmitter ).not.toBeNull();
    } );

    test( 'webIdEventEmitter should emit events', async () => {
        expect.assertions( 1 );
        const theData = 'webId!!!';
        win.webIdEventEmitter.on( 'update', ( data ) => {
            expect( data ).toBe( theData );
        } );

        win.webIdEventEmitter.emit( 'update', theData );
    } );

    /* xtest( 'Check response to store change?' ); */
} );