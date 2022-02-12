import React from "react";
import {Badge} from 'reactstrap';
import MASTER from "../../constants/master";

var color = 'info';

const Role = (props) => {

    switch (props.role){
        case MASTER.ROLE.ADMIN:
            color = 'danger';
            break;
        case MASTER.ROLE.LEADER:
            color = 'success';
            break;
        case MASTER.ROLE.STAFF:
            color = 'primary';
            break;
    }

    return (
        <>
            <Badge
                color={color}
            >{props.name ?? 'Role'}</Badge>
        </>
    )
}

export default Role;