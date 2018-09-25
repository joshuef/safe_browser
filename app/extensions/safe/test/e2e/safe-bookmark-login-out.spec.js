
import opn from 'opn';
import { parse as urlParse } from 'url';
import {
    bookmarkActiveTabPage,
    navigateTo,
    newTab,
    setClientToMainBrowserWindow,
    setClientToBackgroundProcessWindow,
    delay
} from 'spectron-lib/browser-driver';
import {
    createAccountDetails,
    createAccount,
    login,
    logout
} from 'extensions/safe/test/e2e/lib/authenticator-drivers';
import { BROWSER_UI, WAIT_FOR_EXIST_TIMEOUT, DEFAULT_TIMEOUT_INTERVAL } from 'spectron-lib/constants';
import {
    setupSpectronApp
    , isCI
    , travisOS
    , afterAllTests
    , beforeAllTests
    , windowLoaded
    , isTestingPackagedApp
} from 'spectron-lib/setupSpectronApp';

jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL + 90000;


describe( 'SAFE network webFetch operation', async () =>
{
    const appInfo = {
        id     : 'net.peruse.test',
        name   : 'SAFE App Test',
        vendor : 'Peruse'
    };
    let app;

    beforeEach( async () =>
    {
        app = setupSpectronApp();

        await beforeAllTests( app );
    } );

    afterEach( async () =>
    {
        await afterAllTests( app );
    } );


    test( 'window loaded', async () =>
    {
        expect( await windowLoaded( app ) ).toBeTruthy();
    } );


    describe.only( 'saving browser data and access it again.', async ( ) =>
    {
        const { secret, password } = createAccountDetails();

        it( 'can save and reaccess browser bookmark data. AND logout / login with a new account cannot access this.', async ( ) =>
        {
            const { client } = app;

            expect.assertions( 2 );
            const bookmarkTab = await newTab( app );
            await navigateTo( app, 'shouldsavetobookmarks.com' );
            await delay( 2500 );
            await bookmarkActiveTabPage( app );

            await navigateTo( app, 'peruse:bookmarks' );
            await delay( 1500 );

            const bookmarksToSave = await client.getText( '.urlList__table' );

            // bookmarks is an array
            expect( bookmarksToSave ).toMatch( 'shouldsavetobookmarks' );

            await delay( 3500 );

            const authTab = await newTab( app );
            await navigateTo( app, 'safe-auth://home' );
            await delay( 1500 );

            // login
            await createAccount( app, secret, password, authTab );
            await delay( 1500 );


            await setClientToMainBrowserWindow( app );

            // click save.
            await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_SAVE );

            await client.waitForExist( BROWSER_UI.NOTIFICATION__ACCEPT, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );

            await delay( 1500 );
            console.log('---------before logout here')
            await logout( app, authTab );
            console.log('------after logout here')
            await delay( 1500 );

            await login( app, secret, password, authTab );
            await delay( 1500 );

            await setClientToMainBrowserWindow( app );

            // fetch browser config
            await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_LOAD );
            await delay( 3000 );

            await navigateTo( app, 'peruse:bookmarks' );

            console.log('--Checking bookmarks after login')
            await delay( 1500 );
            const bookmarks = await client.getText( '.urlList__table' );

            // bookmarks is an array
            expect( bookmarks.join( ' ' ) ).toMatch( 'shouldsavetobookmarks' );
            // await delay( 1500 );

        } );

        it('should log in with a new account and NOT fetch anything', async () =>
        {
            const { client } = app;

            // now we log out and make a new account.
            // await logout( app );
            // await delay( 1500 );
            // console.log('LOGOUT after bookmarks after login')
            await delay( 3500 );

            await createAccount( app );
            console.log('Created ACCT after bookmarks after login')

            await delay( 1500 );
            await setClientToMainBrowserWindow( app );

            // again the bookmarks
            // fetch browser config
            await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_LOAD );
            await delay( 3000 );

            await navigateTo( app, 'peruse:bookmarks' );
            console.log('Checking bookmarks after login with FRESH')

            await delay( 1500 );
            const bookmarksFinalCheck = await client.getText( '.urlList__table' );
            console.log('Checking bookmarks after login with FRESH:', bookmarksFinalCheck)

            // bookmarksFinalCheck is an array
            expect( bookmarksFinalCheck ).not.toMatch( 'shouldsavetobookmarks' );
        })
    } );

} );
