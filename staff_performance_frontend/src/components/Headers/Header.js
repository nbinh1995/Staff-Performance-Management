import React, {useEffect} from "react";

// reactstrap components
import {Card, CardBody, CardTitle, Container, Row, Col} from "reactstrap";
import {useDispatch, useSelector} from "react-redux";
import {fetchSummary} from "./headerSlice";

const Header = ({isShowCard = '1'}) => {

    const summary = useSelector(state => state.header.summary);
    const dispatch = useDispatch();

    useEffect(() => {
        isShowCard === '1' && dispatch(fetchSummary());
    }, [])

    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                {
                    isShowCard === '1' ? (<Container fluid>
                        <div className="header-body">
                            {/* Card stats */}
                            <Row>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Total Project
                                                    </CardTitle>
                                                    <span
                                                        className="h2 font-weight-bold mb-0">{summary.count_project ?? 'N/A'}</span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div
                                                        className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                        <i className="fab fa-product-hunt"/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Total Employee
                                                    </CardTitle>
                                                    <span
                                                        className="h2 font-weight-bold mb-0">{summary.count_employee ?? 'N/A'}</span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div
                                                        className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                        <i className="fas fa-users"/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Ongoing Projects
                                                    </CardTitle>
                                                    <span
                                                        className="h2 font-weight-bold mb-0">{summary.count_ongoing_project ?? 'N/A'}</span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div
                                                        className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                        <i className="fas fa-project-diagram"/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="6" xl="3">
                                    <Card className="card-stats mb-4 mb-xl-0">
                                        <CardBody>
                                            <Row>
                                                <div className="col">
                                                    <CardTitle
                                                        tag="h5"
                                                        className="text-uppercase text-muted mb-0"
                                                    >
                                                        Ongoing Tasks
                                                    </CardTitle>
                                                    <span
                                                        className="h2 font-weight-bold mb-0">{summary.count_ongoing_task ?? 'N/A'}</span>
                                                </div>
                                                <Col className="col-auto">
                                                    <div
                                                        className="icon icon-shape bg-info text-white rounded-circle shadow">
                                                        <i className="fas fa-running"/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Container>) : ''
                }
            </div>
        </>
    );
};

export default Header;
