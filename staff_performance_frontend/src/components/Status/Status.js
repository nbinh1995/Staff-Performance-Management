import React from "react";
import {Badge} from 'reactstrap';
import MASTER from "../../constants/master";

var color = 'info';

const Status = (props) => {

    switch (props.status){
        case MASTER.STATUS.CANCEL:
            color = 'dark';
            break;
        case MASTER.STATUS.PENDING:
            color = 'primary';
            break;
        case MASTER.STATUS.COMPLETED:
            color = 'success';
            break;
    }

    return (
        <>
            <Badge
                color={color}
            >{props.name ?? 'Status'}</Badge>
        </>
    )
}

export default Status;