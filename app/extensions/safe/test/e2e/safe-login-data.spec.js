
import opn from 'opn';
import { parse as urlParse } from 'url';
import {removeTrailingSlash} from 'utils/urlHelpers';
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
import { createSafeApp, createRandomDomain } from 'extensions/safe/test/e2e/lib/safe-helpers';
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

jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL + 70000 ;


describe( 'SAFE network webFetch operation', async () =>
{
    const appInfo = {
        id: "net.peruse.test",
        name: 'SAFE App Test',
        vendor: 'Peruse'
    };
    let app;

    beforeEach( async () =>
    {
      app = setupSpectronApp();

        await beforeAllTests(app)
    } );

    afterEach( async () =>
    {
        await afterAllTests(app);
    } );


    test( 'window loaded', async () =>
    {
        expect( await windowLoaded( app ) ).toBeTruthy()
    });


    describe.only( 'saving browser data and access it again.', async( ) =>
    {
        const { secret, password } = createAccountDetails();

        it( 'can save browser data.', async( ) =>
        {
            const { client } = app;

            expect.assertions(2);
            const bookmarkTab = await newTab( app );
            await navigateTo( app, 'shouldsavetobookmarks.com' );
            await delay( 2500 );
            await bookmarkActiveTabPage( app );
            console.log('----------> yup')

            await navigateTo( app, 'peruse:bookmarks' );
            await delay( 1500 );

            const bookmarksToSave = await client.getText( '.urlList__table' );

            console.log('bookmarksToSave::::::::::::::;', bookmarksToSave)
            // await delay( 2500 );

            //bookmarks is an array
            expect( bookmarksToSave ).toMatch( 'shouldsavetobookmarks' );

            // expect( bookmarks ).not.toMatch( 'shouldappearinbookmarks' );

            await delay( 3500 );

            const authTab = await newTab( app );
            await navigateTo( app, 'safe-auth://home' );
            await delay( 1500 );

            // login
            await createAccount( app, secret, password, authTab );
            await delay( 1500 );


            await setClientToMainBrowserWindow( app );

            // click save.
            console.log('----------> yup?')
            await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_SAVE );

            await client.waitForExist( BROWSER_UI.NOTIFICATION__ACCEPT, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );

            await delay( 1500 );

            await logout( app, authTab );
            console.log('----------> logged out?')

            await delay( 1500 );

            await login( app, secret, password, authTab );
            console.log('----------> logged innnn?')

            await delay( 1500 );


            await setClientToMainBrowserWindow( app );

            // fetch browser config
            await client.waitForExist( BROWSER_UI.SPECTRON_AREA, WAIT_FOR_EXIST_TIMEOUT );
            await client.click( BROWSER_UI.SPECTRON_AREA__SPOOF_LOAD );

            console.log('clicked load data')

            // await client.waitForExist( BROWSER_UI.NOTIFICATION__ACCEPT, WAIT_FOR_EXIST_TIMEOUT );
            // await client.click( BROWSER_UI.NOTIFICATION__ACCEPT );
            await delay(3000 )

            await navigateTo( app, 'peruse:bookmarks' );

            await delay(1500 )
            console.log('gone to................');
            // await client.windowByIndex( authTab );

            // console.log('gone twwwwo................', await client.ge);
            const bookmarks = await client.getText( '.urlList__table' );

            console.log('bookmarkssssssss', bookmarks)
            // await delay( 2500 );

            //bookmarks is an array
            expect( bookmarks.join(' ') ).toMatch( 'shouldsavetobookmarks' );
            await delay( 3500 );

            // const note = await client.getText( BROWSER_UI.NOTIFIER_TEXT );

        })
    })

    // it( 'has safe:// protocol', async () =>
    // {
    //     expect.assertions( 1 );
    //
    //     await setClientToMainBrowserWindow( app );
    //     const { client } = await app;
    //     const tabIndex = await newTab( app );
    //     await delay(500)
    //     await client.waitForExist( BROWSER_UI.ADDRESS_INPUT );
    //
    //     await navigateTo( app, 'test-url.com' );
    //
    //     const address = await client.getValue( BROWSER_UI.ADDRESS_INPUT );
    //
    //     await client.windowByIndex( tabIndex - 1 );
    //     await delay(1500)
    //     const clientUrl = await client.getUrl();
    //     const parsedUrl = urlParse( clientUrl );
    //
    //     expect( address ).toBe( 'safe://test-url.com' );
    //     // expect( parsedUrl.protocol ).toBe( 'safe:' );
    // } );



} );
