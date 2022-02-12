import React from "react";
import {Badge} from 'reactstrap';
import MASTER from "../../constants/master";

var color = 'info';

const Group = (props) => {

    switch (props.group){
        case MASTER.GROUP.MANAGEMENT:
            color = 'danger';
            break;
        case MASTER.GROUP.BACKEND:
            color = 'success';
            break;
        case MASTER.GROUP.FRONTEND:
            color = 'primary';
            break;
    }

    return (
        <>
            <Badge
                color={color}
            >{props.name ?? 'Group'}</Badge>
        </>
    )
}

export default Group;