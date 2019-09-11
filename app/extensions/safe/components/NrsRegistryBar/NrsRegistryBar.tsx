import React, { Component } from 'react';
// import styles from './browser.css';
import _ from 'lodash';
import { logger } from '$Logger';
// import { logger } from '$Logger';
// import styles from './nrsRegistryBar.css';

interface NrsRegistryBarProps {
    address: string;
    registerNrsName: Function;
}
export class NrsRegistryBar extends Component<NrsRegistryBarProps, {}> {
    handleRegisterAddress = ( webId ) => {
        const { registerNrsName, address } = this.props;

        logger.info( `Registering ${address} on NRS` );

        registerNrsName( address );
    };

    render() {
        const { address } = this.props;

        return (
            <div>
                {`${address} is avilable.`}{' '}
                <button type="button" onClick={this.handleRegisterAddress}>
          Register it now.
                </button>
            </div>
        );
    }
}
