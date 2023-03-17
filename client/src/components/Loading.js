import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react'; 

export default function Loading({ loading }) {
    return (
        <Dimmer active={loading ?? true}>
            <Loader size='large' content='Loading...' />
        </Dimmer>
    );
};