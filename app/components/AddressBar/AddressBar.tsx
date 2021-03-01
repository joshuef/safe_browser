import React, { Component } from 'react';
import { Row, Col } from 'antd';

import styles from './addressBar.css';

import { CLASSES } from '$Constants';
import { ButtonsLHS } from '$Components/AddressBar/ButtonsLHS';
import { ButtonsRHS } from '$Components/AddressBar/ButtonsRHS';
import { Input } from '$Components/AddressBar/Input';
import 'antd/lib/row/style';
import 'antd/lib/col/style';

interface AddressBarProperties {
    address?: string;
    activeTab?: {
        tabId?: string;
        url?: string;
    };
    tabId: string;
    onSelect: ( ...arguments_: Array<any> ) => any;
    onFocus: ( ...arguments_: Array<any> ) => any;
    onBlur: ( ...arguments_: Array<any> ) => any;
    updateTabWebId: ( ...arguments_: Array<any> ) => any;
    windowId: number;
    addBookmark: ( ...arguments_: Array<any> ) => any;
    isBookmarked: boolean;
    updateTabUrl: ( ...arguments_: Array<any> ) => any;
    addTabNext: ( ...arguments_: Array<any> ) => any;
    addTabEnd: ( ...arguments_: Array<any> ) => any;
    removeBookmark: ( ...arguments_: Array<any> ) => any;
    hideSettingsMenu: ( ...arguments_: Array<any> ) => any;
    showSettingsMenu: ( ...arguments_: Array<any> ) => any;
    settingsMenuIsVisible: boolean;
    isSelected: boolean;
    tabBackwards: ( ...arguments_: Array<any> ) => any;
    tabForwards: ( ...arguments_: Array<any> ) => any;
    tabShouldReload: ( ...arguments_: Array<any> ) => any;
    focusWebview: ( ...arguments_: Array<any> ) => any;
    setActiveTab: ( ...arguments_: Array<any> ) => any;
}
export class AddressBar extends Component<
AddressBarProperties,
Record<string, unknown>
> {
    static defaultProps = {
        address: '',
        isSelected: false,
        settingsMenuIsVisible: false,
        editingUrl: false,
    };

    handleBack = () => {
        const { tabBackwards, tabId } = this.props;
        const timeStamp = new Date().getTime();
        tabBackwards( { tabId, timeStamp } );
    };

    handleForward = () => {
        const { tabForwards, tabId } = this.props;
        const timeStamp = new Date().getTime();
        tabForwards( { tabId, timeStamp } );
    };

    handleRefresh = ( event ) => {
    // TODO: if cmd or so clicked, hard.
        event.stopPropagation();
        const { tabShouldReload, tabId } = this.props;
        tabShouldReload( { tabId, shouldReload: true } );
    };

    getSettingsMenuItems = () => {
        const { windowId, addTabEnd } = this.props;
        const tabId = Math.random().toString( 36 );
        const addATab = ( tab ) => {
            addTabEnd( { url: `safe-browser://${tab}`, windowId, tabId } );
        };
        return [
            <Row key="menuItem-bookmarks" type="flex" justify="start" align="middle">
                <div
                    role="menuitem"
                    tabIndex={0}
                    className={`${styles.menuItem} ${CLASSES.SETTINGS_MENU__BOOKMARKS}`}
                    onClick={() => addATab( 'bookmarks' )}
                    onKeyPress={() => addATab( 'bookmarks' )}
                >
          Bookmarks
                </div>
            </Row>,
            <Row key="menuItem-history" type="flex" justify="start" align="middle">
                <div
                    role="menuitem"
                    tabIndex={0}
                    className={`${styles.menuItem} ${CLASSES.SETTINGS_MENU__HISTORY}`}
                    onClick={() => addATab( 'history' )}
                    onKeyPress={() => addATab( 'history' )}
                >
          History
                </div>
            </Row>,
        ];
    };

    render() {
        const { props } = this;
        const {
            address,
            addTabEnd,
            addTabNext,
            updateTabUrl,
            addBookmark,
            updateTabWebId,
            removeBookmark,
            isBookmarked,
            activeTab,
            tabId,
            settingsMenuIsVisible,
            showSettingsMenu,
            hideSettingsMenu,
            focusWebview,
            windowId,
            setActiveTab,
        } = this.props;
        const canGoBackwards = activeTab ? activeTab.historyIndex > 0 : false;
        const canGoForwards = activeTab
            ? activeTab.historyIndex < activeTab.history.length - 1
            : false;
        return (
            <div className={`${styles.container} js-address`}>
                <Row
                    className={styles.addressBar}
                    type="flex"
                    justify="start"
                    align="middle"
                    gutter={{ xs: 4, sm: 8, md: 12 }}
                >
                    <Col>
                        <ButtonsLHS
                            addTabEnd={addTabEnd}
                            activeTab={activeTab}
                            updateTabWebId={updateTabWebId}
                            handleBack={this.handleBack}
                            canGoForwards={canGoForwards}
                            canGoBackwards={canGoBackwards}
                            handleForward={this.handleForward}
                            handleRefresh={this.handleRefresh}
                            {...props}
                        />
                    </Col>
                    <Col className={styles.addressBarCol}>
                        <Input {...this.props} />
                    </Col>
                    <Col>
                        <ButtonsRHS
                            address={address}
                            addTabEnd={addTabEnd}
                            tabId={tabId}
                            isBookmarked={isBookmarked}
                            addBookmark={addBookmark}
                            removeBookmark={removeBookmark}
                            menuItems={this.getSettingsMenuItems()}
                            showSettingsMenu={showSettingsMenu}
                            settingsMenuIsVisible={settingsMenuIsVisible}
                            hideSettingsMenu={hideSettingsMenu}
                            focusWebview={focusWebview}
                            windowId={windowId}
                            setActiveTab={setActiveTab}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
