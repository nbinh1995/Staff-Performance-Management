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
import React from "react";
import {useLocation, Route, Switch, Redirect,} from "react-router-dom";
// reactstrap components
import {Container} from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import {routesAuth as routes} from "../constants/routes";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import {fetchUserData} from "../features/Profile/profileSlice";
import {loginSuccess} from "../features/Auth/authSlice";
// import { checkAuth } from "features/Auth/authSlice";

const Admin = (props) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const mainContent = React.useRef(null);
    const location = useLocation();
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const role = token ? jwt_decode(token).s : null;

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainContent.current.scrollTop = 0;
    }, [location]);

    React.useEffect(() => {
        dispatch(fetchUserData());
    }, []);

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin") {
                return (localStorage.getItem('user') ?
                    (
                        prop.role && prop.role.includes(role)
                            ?
                            (
                                <Route
                                    path={prop.layout + prop.path}
                                    component={prop.component}
                                    key={key}
                                    exact={true}
                                />
                            )
                            :
                            null
                    )
                    : <Redirect to={{pathname: '/login', state: {from: (prop.layout + prop.path)}}} key={key}/>);
            } else {
                return null;
            }
        });
    };

    const sideBarRoutes = (routes) => {
        return routes.map((prop, key) => {
            return prop.role && prop.role.includes(role) ? prop : null;
        });
    }

    const getBrandText = (path) => {
        for (let i = 0; i < routes.length; i++) {
            if (
                props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
                -1
            ) {
                return routes[i].name;
            }
        }
        return "Brand";
    };

    return (
        <>
            <Sidebar
                {...props}
                routes={sideBarRoutes(routes)}
                logo={{
                    innerLink: "/admin/index",
                    imgSrc: require("../assets/img/brand/logo.png").default,
                    imgAlt: "...",
                }}
                profile={profile}
            />
            <div className="main-content" ref={mainContent}>
                <AdminNavbar
                    {...props}
                    brandText={getBrandText(props.location.pathname)}
                    profile={profile}
                />
                <Switch>
                    {getRoutes(routes)}
                    <Redirect from="*" to="/admin/dashboard"/>
                </Switch>
                <Container fluid>
                    <AdminFooter/>
                </Container>
            </div>

        </>
    );
};

export default Admin;
