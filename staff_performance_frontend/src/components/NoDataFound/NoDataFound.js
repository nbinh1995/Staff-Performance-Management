import React from "react";

const NoDataFound = (props) => {
    return (
        <>
            <label className="text-center font-weight-500 text-muted text-sm d-block mt-1 mb-1">{props.text ? props.text : 'No data found!'}</label>
        </>
    )
}

export default NoDataFound;