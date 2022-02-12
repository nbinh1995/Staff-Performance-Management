import React from "react";

import {Spinner} from 'reactstrap';

const Overlay = () => {
    return (
        <>
            <div className='overlay'>
                <Spinner color='info' />
            </div>
        </>
    )
}

export default Overlay;