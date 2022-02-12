/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import {Route, Switch, Redirect, HashRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import {history} from './helper/history';
import {store} from './helper/store';
import {ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Overlay from "./components/Overlay/Overlay";

ReactDOM.render(
    <Provider store={store}>
        <HashRouter history={history}>
            <Suspense fallback={<Overlay/>}>
                <Switch>
                    <Route path="/admin" render={(props) => <AdminLayout {...props} />}/>
                    <Route path="/" render={(props) => <AuthLayout {...props} />}/>
                    <Redirect from="/" to="/admin/dashboard"/>
                </Switch>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Suspense>
        </HashRouter>
    </Provider>,
    document.getElementById("root")
);
