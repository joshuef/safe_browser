import { TYPES } from '$Actions/windows_actions';
import { logger } from '$Logger';
import { TYPES as TAB_TYPES } from '$Actions/tabs_actions';
import { initialAppState } from './initialAppState';

const initialState = initialAppState.windows;

const addWindow = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const openWindows = { ...state.openWindows };
    const closedWindows = { ...state.closedWindows };
    const newState = {
        openWindows: {
            ...openWindows,
            [targetWindow]: {
                activeTab: null,
                ui: {
                    settingsMenuIsVisible: false
                },
                tabs: []
            }
        },
        closedWindows: {
            ...closedWindows,
            [targetWindow]: {
                closedtabs: [],
                lastActiveTabs: []
            }
        }
    };
    return newState;
};

const addTabNext = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };
    const newState = { ...state, openWindows };

    const newWindow = {
        activeTab: null,
        ui: {
            settingsMenuIsVisible: false
        },
        tabs: [...openWindows[targetWindow].tabs]
    };

    const lastTabIndex = ++tab.tabIndex || 0;

    newWindow.tabs.splice( lastTabIndex, 0, tabId );

    newState.openWindows[targetWindow] = newWindow;
    return newState;
};

const addTabEnd = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };
    const newState = { ...state, openWindows };

    const newWindow = {
        activeTab: null,
        ui: {
            settingsMenuIsVisible: false
        },
        tabs: [...openWindows[targetWindow].tabs, tabId]
    };

    newState.openWindows[targetWindow] = newWindow;

    return newState;
};

const setActiveTab = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };

    const newOpenWindows = {
        ...state.openWindows,
        [targetWindow]: {
            ...openWindows[targetWindow],
            activeTab: tabId
        }
    };

    const newState = { ...state, openWindows: newOpenWindows };
    return newState;
};

const closetab = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };
    const closedWindows = { ...state.closedWindows };

    const lastTabIndex = openWindows[targetWindow].tabs.findIndex( ( tab ) => {
        return tab === tabId;
    } );

    const newOpenTabs = openWindows[targetWindow].tabs.filter(
        ( tab ) => tab !== tabId
    );

    const tabsIndexLength = openWindows[targetWindow].tabs.length - 1;

    const newActiveTab =
    tabsIndexLength === lastTabIndex
        ? newOpenTabs[tabsIndexLength - 1]
        : newOpenTabs[lastTabIndex];

    openWindows[targetWindow] = {
        ...openWindows[targetWindow],
        tabs: newOpenTabs,
        activeTab: newActiveTab
    };

    const closedTabObj = {
        tabId,
        lastTabIndex
    };

    closedWindows[targetWindow].closedtabs.push( closedTabObj );

    const newState = {
        ...state,
        openWindows,
        closedWindows
    };
    return newState;
};

const reOpenTab = ( state, tabs ) => {
    const targetWindowId = tabs.windowId;

    const newOpenWindows = { ...state.openWindows };
    const closedWindows = { ...state.closedWindows };

    const closedWindowTabs = closedWindows[targetWindowId].closedtabs;

    closedWindows[targetWindowId] = {
        ...closedWindows[targetWindowId],
        closedTabs: closedWindowTabs
    };

    const lastTabObj = closedWindowTabs.pop();

    const { tabId, lastTabIndex } = lastTabObj;

    const newTabs = newOpenWindows[targetWindowId].tabs.splice(
        lastTabIndex,
        0,
        tabId
    );

    const newWindow = {
        ...newOpenWindows[targetWindowId],
        tabs: newTabs
    };

    newOpenWindows[targetWindowId] = newWindow;

    const newState = {
        ...state,
        openWindows: newOpenWindows,
        closedWindows
    };

    return newState;
};

const closeWindow = ( state, tab ) => {
    const targetwindow = tab.windowId;

    const newOpenWindows = { ...state.openWindows };
    const newClosedWindows = { ...state.closedWindows };

    const newTabs = [...state.newOpenWindows[targetwindow].tabs];
    const newCloseWindow = {
        ...newClosedWindows[targetwindow],
        lastActiveTabs: newTabs
    };

    delete newOpenWindows[targetwindow];

    newClosedWindows[targetwindow] = newCloseWindow;

    const newState = {
        ...state,
        closedWindows: newClosedWindows,
        openWindows: newOpenWindows
    };
    return newState;
};

function toggleMenu( state, payload, showMenu ) {
    const targetWindow = payload.windowId;
    const openWindows = { ...state.openWindows };
    const newWindow = {
        ...openWindows[targetWindow],
        ui: {
            settingsMenuIsVisible: showMenu
        }
    };
    const newOpenWindows = { ...state.openWindows, [targetWindow]: newWindow };
    const newState = { ...state, openWindows: newOpenWindows };
    return newState;
}

const showSettingsMenu = ( state, payload ) => {
    const showMenu = true;
    const newState = toggleMenu( state, payload, showMenu );
    return newState;
};

const hideSettingsMenu = ( state, payload ) => {
    const showMenu = false;
    const newState = toggleMenu( state, payload, showMenu );
    return newState;
};

const resetStore = ( state, payload ) => {
    const targetWindow = payload.windowId;
    const { tabId } = payload;
    const newState = {
        openWindows: {
            [targetWindow]: {
                activeTab: tabId,
                ui: {
                    settingsMenuIsVisible: false
                },
                tabs: [tabId]
            }
        },
        closedWindows: {
            [targetWindow]: {
                closedtabs: [],
                lastActiveTabs: []
            }
        }
    };
    return newState;
};

export const windows = ( state: object = initialState, action ) => {
    const { payload } = action;

    if ( action.error ) {
        logger.error( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type ) {
        case TYPES.ADD_WINDOW: {
            return addWindow( state, payload );
        }
        case TYPES.ADD_TAB_NEXT: {
            return addTabNext( state, payload );
        }
        case TYPES.ADD_TAB_END: {
            return addTabEnd( state, payload );
        }
        case TYPES.SET_ACTIVE_TAB: {
            return setActiveTab( state, payload );
        }
        case TYPES.WINDOW_CLOSE_TAB: {
            return closetab( state, payload );
        }
        case TYPES.REOPEN_TAB: {
            return reOpenTab( state, payload );
        }
        case TYPES.CLOSE_WINDOW: {
            return closeWindow( state, payload );
        }
        case TYPES.SHOW_SETTINGS_MENU: {
            return showSettingsMenu( state, payload );
        }
        case TYPES.HIDE_SETTINGS_MENU: {
            return hideSettingsMenu( state, payload );
        }
        case TAB_TYPES.RESET_STORE: {
            return resetStore( state, payload );
        }
        default:
            return state;
    }
};