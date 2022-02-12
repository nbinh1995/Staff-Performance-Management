import React from "react";
import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";

// reactstrap components
import {
    Container,
    Row, Media, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Button, Input, Col, Label
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import {
    setUsers,
    getFail,
    changeSort,
    changePage,
    changeFilter,
    deleteUserSuccess, deleteUserFail, resetPasswordSuccess, resetPasswordFail
} from "./employeesSlice";
import {fetchDeleteUser, fetchResetPassword, fetchUsers} from "./employeesService";
import {USER_AVATAR} from "../../constants/employeeAPI";
import Overlay from "../../components/Overlay/Overlay";
import Role from "../../components/Role/Role";
import Group from "../../components/Group/Group";
import {confirmAlert, errorAlert, successAlert} from "../../helper/alerts";

//DataTable
import DataTable from "../../components/DataTable/DataTable";
import {history} from "../../helper/history";

export default function Employees() {

    const dispatch = useDispatch();
    const employees = useSelector(state => state.employees);
    const isLoading = useSelector(state => state.app.isLoading);

    useEffect(() => {
        fetchUserList(employees.query);
    }, [employees.query]);

    function fetchUserList() {
        fetchUsers(employees.query)
            .then((response) => {
                if (response.data.status === 200) {
                    dispatch(setUsers(
                        {
                            users: response.data.data.data,
                            page_count: response.data.data.last_page,
                        }
                    ));
                } else {
                    dispatch(getFail())
                }
            });
    }

    function alertDelete(user) {
        confirmAlert({
            title: "Are you sure want to delete this user?",
            closeOnConfirm: false,
        })
            .then((confirm) => {
                if (confirm) {
                    return fetchDeleteUser(user);
                } else {
                    throw null;
                }
            })
            .then(response => {
                if (response.data.status === 200) {
                    dispatch(deleteUserSuccess());
                    fetchUserList();
                } else {
                    dispatch(deleteUserFail());
                }
            });
    }

    function handleResetPassword(id) {
        fetchResetPassword(id)
            .then(response => {
                if (response.data.status === 200) {
                    dispatch(resetPasswordSuccess());
                } else {
                    dispatch(resetPasswordFail());
                }
            });
    }

    function handleDetail(id) {
        history.push(`/admin/employees-management/${id}/detail`);
    }

    function handleSort(sortData) {
        if (sortData.length > 0) {
            const {id, desc} = sortData[0];
            dispatch(changeSort({by: id, order: desc ? 'desc' : 'asc'}));
        }
    }

    function handlePaging(page = 0) {
        if (!isNaN(page)) {
            if (parseInt(page) + 1 !== employees.query.page) {
                dispatch(changePage({page: parseInt(page) + 1}));
            }
        }
    }

    function handleFilter(q) {
        dispatch(changeFilter({q: q === undefined ? '' : q}));
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Action',
                disableSortBy: true,
                Cell: props => (
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v"/>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                className='text-success'
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push(`/admin/employees-management/${props.row.original.id}/edit`)
                                }}
                            >
                                <i className="fas fa-edit fa-fw"/>
                                Edit
                            </DropdownItem>
                            {
                                props.row.original.id !== 1
                                &&
                                <DropdownItem
                                    className='text-danger'
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alertDelete(props.row.original);
                                    }}
                                >
                                    <i className="fas fa-trash fa-fw"/>
                                    Remove
                                </DropdownItem>
                            }
                            <DropdownItem
                                className='text-primary'
                                href="#"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        handleDetail(props.row.original.id);
                                    }
                                }
                            >
                                <i className="fas fa-info-circle fa-fw"/>
                                Detail
                            </DropdownItem>
                            {
                                props.row.original.id !== 1
                                &&
                                <DropdownItem
                                    className='text-indigo'
                                    href="#"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            handleResetPassword(props.row.original.id);
                                        }
                                    }
                                >
                                    <i className="fas fa-sync-alt fa-fw"/>
                                    Reset Password
                                </DropdownItem>
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                ),
            },
            {
                Header: 'Avatar',
                accessor: 'avatar',
                disableSortBy: true,
                Cell: props => {
                    return (
                        props.row.original.avatar
                            ?
                            (
                                <img src={USER_AVATAR + props.row.original.avatar}
                                     className="avatar-sm avatar rounded-circle" alt={props.row.original.full_name}/>
                            )
                            :
                            (
                                <img src={require("../../assets/img/theme/team-1-800x800.jpg").default}
                                     className="avatar-sm avatar rounded-circle" alt={props.row.original.full_name}/>
                            )

                    )
                },
            },
            {
                Header: 'Full Name',
                accessor: 'full_name',
                Cell: props => <Label className="font-weight-600">{props.row.original.full_name}</Label>,
            },
            {
                Header: 'Email',
                accessor: 'email',
                Cell: props => {
                    return (<a href={"mailto:" + props.row.original.email}>{props.row.original.email}</a>)
                },
            },
            {
                Header: 'Birthday',
                accessor: 'dob',
            },
            {
                Header: 'Phone',
                accessor: 'phone',
            },
            {
                Header: 'Salary',
                accessor: 'salary',
                Cell: props => !isNaN(props.row.original.salary) && props.row.original.salary !== null && parseFloat(props.row.original.salary).toLocaleString(navigator.language, {
                    minimumFractionDigits: 0,
                    style: 'currency',
                    currency: 'VND'
                }),
            },
            {
                Header: 'Pay per hour',
                accessor: 'pay_per_hour',
                Cell: props => !isNaN(props.row.original.pay_per_hour) && props.row.original.pay_per_hour !== null && parseFloat(props.row.original.pay_per_hour).toLocaleString(navigator.language, {
                    minimumFractionDigits: 0,
                    style: 'currency',
                    currency: 'VND'
                }),
            },
            {
                Header: 'Group',
                accessor: 'group.name',
                disableSortBy: true,
                Cell: props => <Group name={props.row.original.group.name}
                                      group={props.row.original.group.slug ?? ''}/>,
            },
            {
                Header: 'Role',
                accessor: 'role.name',
                disableSortBy: true,
                Cell: props => <Role name={props.row.original.role.name} role={props.row.original.role.slug ?? ''}/>,
            },
        ],
    );

    return (
        <>
            <Header isShowCard={0}/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <Col className="col">
                        {isLoading && <Overlay/>}
                        <DataTable
                            showAddBtn={true}
                            DOMBtnAdd={Employees.AddButton}
                            showFilter={true}
                            showPageInfo={true}
                            currentPage={employees.query.page}
                            onChange={(q) => handleFilter(q)}
                            onSort={(sortData) => handleSort(sortData)}
                            onPaging={(pagingData) => handlePaging(pagingData)}
                            name="List of Employee"
                            columns={columns}
                            data={employees.users}
                            pageCount={employees.page_count}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

Employees.AddButton = () => {
    return (
        <Button color="primary" onClick={() => {
            history.push('employees-management/add')
        }}>
            <i className="fas fa-plus-circle"/> Add Employee
        </Button>
    );
}
