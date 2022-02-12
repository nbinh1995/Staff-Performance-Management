import React, {useEffect} from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchEffortData,
    fetchTasksData,
} from "./profileSlice";
import MASTER from "../../constants/master";
import Group from "../../components/Group/Group";
import Role from "../../components/Role/Role";
import DataTable from "../../components/DataTable/DataTable";
import ENV from "../../env";
import {changeFilter, changePage, changeSort} from "./profileSlice";
import Overlay from "../../components/Overlay/Overlay";
import Status from "../../components/Status/Status";
import NoDataFound from "../../components/NoDataFound/NoDataFound";
import Chart from "react-apexcharts";

const Profile = () => {

    const profile = useSelector(state => state.profile);
    const isLoading = useSelector(state => state.app.isLoading);
    const dispatch = useDispatch();
    const effortData = {
        labels: profile.efforts.map((item) => {
            return item.name;
        }),
        datasets: [
            {
                data: profile.efforts.map((item) => {
                    return item.user_effort;
                }),
                name: 'My Efforts',
            },
            {
                data: profile.efforts.map((item) => {
                    return item.user_effort_ot;
                }),
                name: 'My Efforts OT',
            },
            {
                data: profile.efforts.map((item) => {
                    return item.avg_effort;
                }),
                name: "AVG Efforts",
            },
            {
                data: profile.efforts.map((item) => {
                    return item.total_effort;
                }),
                name: "Total Efforts",
            }
        ]
    };
    const options = {
        chart: {
            id: 'chart',
        },
        xaxis: {
            categories: effortData.labels,
            labels: {
                trim: true,
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return parseFloat(value).toLocaleString();
                },
            },
        },
        markers: {
            size: 4,
        },
        stroke: {
            width: 3,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
        },
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    useEffect(() => {
        fetchTaskList();
    }, [profile.query]);

    function fetchTaskList() {
        dispatch(fetchTasksData(profile.query))
    }

    function fetchChartData() {
        dispatch(fetchEffortData())
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Project',
                accessor: 'project.name',
                disableSortBy: true,
            },
            {
                Header: 'My Effort',
                accessor: 'effort_task',
            },
            {
                Header: 'My Effort OT',
                accessor: 'effort_OT',
            },
            {
                Header: 'Estimate',
                accessor: 'project.estimate',
                disableSortBy: true,
            },
            {
                Header: 'Task Status',
                accessor: 'status',
                Cell: props => <Status name={props.row.original.status} status={props.row.original.status}/>,
            },
        ],
    );

    function handleSort(sortData) {
        if (sortData.length > 0) {
            const {id, desc} = sortData[0];
            dispatch(changeSort({by: id, order: desc ? 'desc' : 'asc'}));
        }
    }

    function handlePaging(page = 0) {
        if (!isNaN(page)) {
            if (parseInt(page) + 1 !== profile.query.page) {
                dispatch(changePage({page: parseInt(page) + 1}));
            }
        }
    }

    function handleFilter(q) {
        dispatch(changeFilter({q: q === undefined ? '' : q}));
    }

    return (
        <>
            <UserHeader/>
            {/* Page content */}
            {isLoading && <Overlay />}
            <Container className="mt--7" fluid>
                {/* User info */}
                <Row>
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                        <a href="#" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src={profile.user.avatar
                                                    ?
                                                    (ENV.DOMAIN + MASTER.STORAGE_PATH + profile.user.avatar)
                                                    :
                                                    require("../../assets/img/theme/team-1-800x800.jpg")
                                                        .default
                                                }
                                            />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            </CardHeader>
                            <CardBody className="pt-100">
                                <div className="text-center">
                                    <h3>
                                        {profile.user.full_name}
                                        <span
                                            className="font-weight-light">, {profile.user.dob}</span>
                                    </h3>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2"/>
                                        <Group group={profile.user.group ? profile.user.group.slug : ''}
                                               name={profile.user.group ? profile.user.group.name : 'N/A'}/>
                                    </div>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2"/>
                                        <Role role={profile.user.role ? profile.user.role.slug : ''}
                                              name={profile.user.role ? profile.user.role.name : 'N/A'}/>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="order-xl-1" xl="8">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0 text-uppercase">My account</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <h6 className="heading-small text-muted mb-4">
                                    User information
                                </h6>
                                <Row className="pl-lg-4">
                                    <Col>
                                        <Row className="mb-2">
                                            <div className="col-sm-3">
                                                <h4 className="mb-0">Full Name</h4>
                                            </div>
                                            <div className="col-sm-9">
                                                {profile.user.full_name}
                                            </div>
                                        </Row>
                                        <Row className="mb-2">
                                            <div className="col-sm-3">
                                                <h4 className="mb-0">Email</h4>
                                            </div>
                                            <div className="col-sm-9">
                                                {profile.user.email}
                                            </div>
                                        </Row>
                                        <Row className="mb-2">
                                            <div className="col-sm-3">
                                                <h4 className="mb-0">Birthday</h4>
                                            </div>
                                            <div className="col-sm-9">
                                                {profile.user.dob}
                                            </div>
                                        </Row>
                                        <Row className="mb-2">
                                            <div className="col-sm-3">
                                                <h4 className="mb-0">Phone</h4>
                                            </div>
                                            <div className="col-sm-9">
                                                {profile.user.phone}
                                            </div>
                                        </Row>
                                        <Row className="mb-2">
                                            <div className="col-sm-3">
                                                <h4 className="mb-0">Salary</h4>
                                            </div>
                                            <div className="col-sm-9">
                                                {profile.user.salary ? parseFloat(profile.user.salary).toLocaleString(navigator.language, {
                                                    minimumFractionDigits: 0,
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }) : ''}
                                            </div>
                                        </Row>
                                        <Row className="mb-2">
                                            <div className="col-sm-3">
                                                <h4 className="mb-0">Pay per hour</h4>
                                            </div>
                                            <div className="col-sm-9">
                                                {profile.user.pay_per_hour ? parseFloat(profile.user.pay_per_hour).toLocaleString(navigator.language, {
                                                    minimumFractionDigits: 0,
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }) : ''}
                                            </div>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Chart info */}
                <Row>
                    <Col xl={12} className="mb-xl-0 pt-4">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0 text-uppercase">Chart</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xl={12}>
                                        {
                                            profile.efforts.length
                                                ?
                                                (
                                                    <Chart
                                                        options={options}
                                                        series={effortData.datasets}
                                                        type="line"
                                                        height="450"
                                                    />
                                                )
                                                :
                                                <NoDataFound/>
                                        }
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Tasks info */}
                <Row>
                    <Col xl={12} className="mb-xl-0 pt-4">
                        <Card className="shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0 text-uppercase">Tasks Information</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <div className="task-table">
                                {profile.is_loading && <Overlay/>}
                                <DataTable
                                    showAddBtn={false}
                                    showFilter={true}
                                    showPageInfo={true}
                                    currentPage={profile.query.page}
                                    onChange={(q) => handleFilter(q)}
                                    onSort={(sortData) => handleSort(sortData)}
                                    onPaging={(pagingData) => handlePaging(pagingData)}
                                    columns={columns}
                                    data={profile.tasks}
                                    pageCount={profile.page_count}
                                    showCard={false}
                                    textSmall={true}/>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;
