import React from "react";

const TextAlert = (props) => {
    return (
        <p className={"text-alert" + (props.customClass ? (" " + props.customClass) : "")}>{props.text}</p>
    )
}

export default TextAlert;