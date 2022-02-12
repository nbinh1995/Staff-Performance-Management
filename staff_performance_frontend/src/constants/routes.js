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
import React from 'react';
import MASTER from "./master";

const Index = React.lazy(() => import('../features/Index/Index'));
const Login = React.lazy(() => import('../features/Auth/Login'));
const Employees = React.lazy(() => import('../features/Employees/Employees'));
const AddEmployee = React.lazy(() => import('../features/Employees/Employee/AddEmployee'));
const EditEmployee = React.lazy(() => import('../features/Employees/Employee/EditEmployee'));
const DetailEmployee = React.lazy(() => import('../features/Employees/Employee/DetailEmployee'));
const Projects = React.lazy(() => import('../features/Projects/Projects'));
const FormProject = React.lazy(() => import('../features/Projects/FormProject'));
const DetailProject = React.lazy(() => import('../features/Projects/DetailProject'));
const Reports = React.lazy(() => import('../features/Reports/Reports'));
const Profile = React.lazy(() => import('../features/Profile/Profile'));

export const routesAuth = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: Index,
        layout: "/admin",
        showSideBar: true,
        role: [MASTER.ROLE.ADMIN],
    },
    {
        path: "/employees-management",
        name: "Employees",
        icon: "ni ni-single-02 text-yellow",
        component: Employees,
        layout: "/admin",
        showSideBar: true,
        role: [MASTER.ROLE.ADMIN],
    },
    {
        path: "/employees-management/add",
        name: "Add Employee",
        icon: "ni ni-single-02 text-yellow",
        component: AddEmployee,
        layout: "/admin",
        showSidebar: false,
        role: [MASTER.ROLE.ADMIN],
    },
    {
        path: "/employees-management/:id/edit",
        name: "Edit Employee",
        icon: "ni ni-single-02 text-yellow",
        component: EditEmployee,
        layout: "/admin",
        showSidebar: false,
        role: [MASTER.ROLE.ADMIN],
    },
    {
        path: "/employees-management/:id/detail",
        name: "Detail Employee",
        icon: "ni ni-single-02 text-yellow",
        component: DetailEmployee,
        layout: "/admin",
        showSidebar: false,
        role: [MASTER.ROLE.ADMIN],
    },
    {
        path: "/projects-management",
        name: "Projects",
        icon: "ni ni-archive-2 text-blue",
        component: Projects,
        layout: "/admin",
        showSideBar: true,
        role: [MASTER.ROLE.ADMIN, MASTER.ROLE.LEADER],
    },
    {
        path: "/projects-management/add",
        name: "Add Project",
        icon: "ni ni-archive-2 text-blue",
        component: FormProject,
        layout: "/admin",
        showSideBar: false,
        role: [MASTER.ROLE.ADMIN, MASTER.ROLE.LEADER],
    },
    {
        path: "/projects-management/:id/edit",
        name: "Edit Project",
        icon: "ni ni-archive-2 text-blue",
        component: FormProject,
        layout: "/admin",
        showSideBar: false,
        role: [MASTER.ROLE.ADMIN, MASTER.ROLE.LEADER],
    },
    {
        path: "/projects-management/:id/detail",
        name: "Detail Project",
        icon: "ni ni-archive-2 text-blue",
        component: DetailProject,
        layout: "/admin",
        showSideBar: false,
        role: [MASTER.ROLE.ADMIN, MASTER.ROLE.LEADER],
    },
    {
        path: "/reports-management",
        name: "Reports",
        icon: "ni ni-book-bookmark text-pink",
        component: Reports,
        layout: "/admin",
        showSideBar: true,
        role: [MASTER.ROLE.ADMIN, MASTER.ROLE.LEADER],
    },
    {
        path: "/profile",
        name: "Profile",
        icon: "ni ni-circle-08 text-purple",
        component: Profile,
        layout: "/admin",
        showSideBar: true,
        role: [MASTER.ROLE.ADMIN, MASTER.ROLE.LEADER, MASTER.ROLE.STAFF],
    },
];


export const routesGuest = [
    {
        path: "/login",
        name: "Login",
        icon: "ni ni-tv-2 text-primary",
        component: Login,
        layout: "/auth",
    }
]
