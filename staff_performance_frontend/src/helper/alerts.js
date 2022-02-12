import {toast} from 'react-toastify';
import swal from "@sweetalert/with-react";

const toastConfigs = {
    position: "top-right",
    autoClose: 1700,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const successAlert = (message) => {
    return toast.success(`☞ ${message}`, toastConfigs);
}

export const infoAlert = (message) => {
    return toast.info(`☞ ${message}`, toastConfigs);
}

export const warningAlert = (message) => {
    return toast.warn(`☞ ${message}`, toastConfigs);
}

export const errorAlert = (message) => {
    return toast.error(`☞ ${message}`, toastConfigs);
}

export const defaultAlert = (message) => {
    return toast(`☞ ${message}`, toastConfigs);
}

export const darkAlert = (message) => {
    return toast.dark(`☞ ${message}`, toastConfigs);
}

export const confirmAlert = (props) => {
    return swal(
        {
            title: props && props.title ? props.title : "Are you sure want to delete this item",
            text: props && props.text ? props.text : "Once deleted, you will not be able to recover this item!",
            icon: props && props.icon ? props.icon : "warning",
            buttons: props && props.buttons ? props.buttons : true,
            dangerMode: props && props.dangerMode ? props.dangerMode : true,
            closeOnConfirm: props && props.closeOnConfirm ? props.closeOnConfirm : true,
            showLoaderOnConfirm: true,
        }
    );
}
