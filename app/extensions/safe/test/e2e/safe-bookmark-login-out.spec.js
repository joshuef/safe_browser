
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

jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL + 320000;


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


    describe( 'saving browser data and access it again.', async ( ) =>
    {
        const { secret, password } = createAccountDetails();
        console.log('Creating authed app with deets: ', secret, password)
        it( 'can save and reaccess browser bookmark data.', async ( ) =>
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
            // console.log('saveddd deeetss')
            // await delay( 1500 );
            // console.log('---------before logout here')
            // await logout( app, authTab );
            // console.log('------after logout here')
            // await delay( 1500 );
            //
            // await login( app, secret, password );
            // await delay( 1500 );
            //
            // // WHY NOT LOGGED IN w second window?
            //
            // await setClientToMainBrowserWindow( app );
            //
            // console.log('waiting for auth note, but it wont come as new acocutns reauth automatically')
            // // await client.waitForExist( BROWSER_UI.NOTIFICATION__ACCEPT, WAIT_FOR_EXIST_TIMEOUT );
            // // await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );
            // // await delay( 3000 );
            //
            //
            // await navigateTo( app, 'peruse:bookmarks' );
            // // fetch browser config
            // await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            // await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_LOAD );
            // await delay( 5000 );
            //
            // console.log('--Checking bookmarks after login')
            // await delay( 1500 );
            // const bookmarks = await client.getText( '.urlList__table' );
            // console.log('received:::', bookmarks)
            // // bookmarks is an array
            // expect( bookmarks ).toMatch( 'shouldsavetobookmarks' );
            // await delay( 1500 );

        } );
        //
        // it('should log in with a new account and NOT fetch anything', async () =>
        // {
        //     const { client } = app;
        //
        //     await delay( 3500 );
        //
        //     await createAccount( app );
        //     console.log('Created ACCT after bookmarks after login')
        //
        //     await delay( 1500 );
        //     await setClientToMainBrowserWindow( app );
        //
        //     await client.waitForExist( BROWSER_UI.NOTIFICATION__ACCEPT, WAIT_FOR_EXIST_TIMEOUT );
        //     await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );
        //     console.log('NEW ACCOUNT CHECK. accepted')
        //     await delay( 1500 );
        //
        //     // again the bookmarks
        //     // fetch browser config
        //     await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
        //     await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_LOAD );
        //     await delay( 6000 );
        //
        //     await navigateTo( app, 'peruse:bookmarks' );
        //     console.log('Checking bookmarks after login with FRESH')
        //
        //     await delay( 1500 );
        //     const bookmarksFinalCheck = await client.getText( '.urlList__table' );
        //     console.log('Checking bookmarks after login with FRESH:', bookmarksFinalCheck)
        //
        //     // bookmarksFinalCheck is an array
        //     expect( bookmarksFinalCheck ).not.toMatch( 'shouldsavetobookmarks' );
        // })


        it('login with a new account cannot after logout of old, cannot access prev account data.', async () =>
        {
            const { client } = app;

            await setClientToMainBrowserWindow( app );

            // await delay( 1500 );
            console.log('THAT BIG CHECKKKKKKKKKKKKKKKKKKKKKKK')
            // const authTab = await newTab( app );
            // await navigateTo( app, 'safe-auth://home' );
            await delay( 1500 );

            await login( app, secret, password );
            await delay( 1500 );

            await setClientToMainBrowserWindow( app );
            console.log('LAST TESTTT')
            // fetch browser config
            await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_LOAD );
            await delay( 7000 );

            await navigateTo( app, 'peruse:bookmarks' );

            console.log('--Checking bookmarks after login')
            await delay( 1500 );
            const bookmarks = await client.getText( '.urlList__table' );

            // bookmarks is an array
            // expect( bookmarks ).toMatch( 'shouldsavetobookmarks' );

            await logout( app );

            console.log('POST LOGOUT login')

            await delay( 6500 );

            await createAccount( app );
            console.log('Created ACCT after bookmarks after login')

            await client.waitForExist( BROWSER_UI.NOTIFICATION__ACCEPT, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );
            console.log('NEW ACCOUNT CHECK. accepted')
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


        });
    } );

} );
