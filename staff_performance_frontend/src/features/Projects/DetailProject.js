import React, {useEffect, useState} from 'react'
import {
    Card,
    CardHeader,
    Container,
    Row,
    CardBody,
    Col,
    Modal,
    Button,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Label,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink
} from "reactstrap";
import Header from "components/Headers/Header.js";
import Select from 'react-select'
import {Link, useParams} from 'react-router-dom';
import {getAllUser, showProject} from './projectsService';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {changeFilter, changePage, fetchTasks} from './Tasks/taskSlide';
import {destroyTask, editTask, getUserByProject, storeTask, updateTask} from './Tasks/taskService';
import TextAlert from 'components/TextAlert/TextAlert';
import {STATUS} from 'constants/projectApi';
import {confirmAlert} from 'helper/alerts';
import {successAlert} from 'helper/alerts';
import {errorAlert} from 'helper/alerts';
import * as Yup from "yup";

export default function DetailProject() {
    const {id} = useParams();
    const Tasks = useSelector(state => state.task);
    const dispatch = useDispatch();
    const [project, setProject] = useState({});
    const [IDModal, setIDModal] = useState(0);
    const [toggleModal, setToggleModal] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProject = (project_id) => {
            showProject(project_id)
                .then(response => {
                    setProject(response.data.data)
                }).catch(errors => {
            })
        }
        fetchProject(id);
    }, []);
    useEffect(() => {
        if (!toggleModal) {
            const fetchTaskListOfProject = (query) => {
                dispatch(fetchTasks(query));
            }
            fetchTaskListOfProject({...Tasks.query, id: id});
        }
    }, [Tasks.query, toggleModal]);

    const handleToggleModal = (e) => {
        if (e.target.hasAttribute("task_id")) {
            const newIDModal = e.target.getAttribute("task_id");
            setIDModal(newIDModal);
        }
        const newToggleModal = !toggleModal;
        setToggleModal(newToggleModal);
    }
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        let param = e.target.querySelector('[name=search_task]').value;
        if (Tasks.query.q !== param) {
            dispatch(changeFilter({q: param}));
        }
    }
    const handleInputSearch = (e) => {
        let param = e.target.value;
        setSearch(param);
    }

    const handleChangePage = (page) => {
        dispatch(changePage({page: parseInt(page)}));
    }
    return (
        <>
            <Header isShowCard='0'/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-bottom-1 d-lg-flex align-items-lg-center">
                                <h3 className="mb-0 ">Projects Detail</h3>
                                <Form className="navbar-search d-none d-lg-block form-inline ml-auto"
                                      onSubmit={handleSubmitSearch}>
                                    <FormGroup className="mb-0">
                                        <InputGroup className="input-group-alternative border-0">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <button type='submit'
                                                            style={{backgroundColor: 'transparent', border: 'none'}}><i
                                                        className="fas fa-search text-light"/></button>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Search" name='search_task' type="text" value={search}
                                                   onInput={handleInputSearch}/>
                                        </InputGroup>
                                    </FormGroup>
                                </Form>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg={4}>
                                        <h3 className='text-info text-uppercase'>
                                            <i className='ni ni-app mr-2'></i>
                                            {project.name}
                                        </h3>
                                        <div className='text-muted'>
                                            <p className='text-sm'>
                                                Project Leader:
                                                <b className='ml-2'>{project.leader}</b>
                                            </p>
                                            <p className='text-sm'>
                                                Estimate:
                                                <b className='ml-2'>{project.estimate}</b>
                                            </p>
                                            <div className='d-flex'>
                                                <p className='text-sm'>Start Date:
                                                    <b className='ml-2'>{project.start_date}</b></p>
                                                <p className='mx-2'> ~ </p>
                                                <p className='text-sm'>End Date:
                                                    <b className='ml-2'>{project.end_date}</b></p>
                                            </div>
                                            <p className='text-sm'>
                                                Status:
                                                <b className='text-capitalize ml-2'>{project.status}</b>
                                            </p>
                                            <div className='d-flex justify-content-center justify-content-lg-start'>
                                                <Link className='btn btn-info' to={{
                                                    pathname: `/admin/projects-management/${id}/edit`,
                                                    state: {from: `/admin/projects-management/${id}/detail`}
                                                }}><i className="fas fa-edit"></i> Edit Project</Link>
                                                <button className='btn btn-primary' task_id='0'
                                                        onClick={handleToggleModal}><i
                                                    className="fas fa-plus-circle"></i> Add Task
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={8}>
                                        <div className='d-lg-none'>
                                            <hr className="my-4"/>
                                            <Form
                                                className="navbar-search d-lg-none d-flex form-inline justify-content-center"
                                                onSubmit={handleSubmitSearch}>
                                                <FormGroup className="mb-0">
                                                    <InputGroup className="input-group-alternative border-0">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <button type='submit' style={{
                                                                    backgroundColor: 'transparent',
                                                                    border: 'none'
                                                                }}><i className="fas fa-search text-light"/></button>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input placeholder="Search" name='search_task' type="text"
                                                               value={search} onInput={handleInputSearch}/>
                                                    </InputGroup>
                                                </FormGroup>
                                            </Form>
                                            <hr className="my-4"/>
                                        </div>
                                        <div>
                                            {
                                                Tasks.data.length > 0 ? Tasks.data.map((task, key) => (
                                                    <DetailProject.Task key={key} Task={task}
                                                                        toggleModal={handleToggleModal}
                                                                        dispatch={dispatch}
                                                                        Query={{...Tasks.query, id: id}}/>)) : (
                                                    <Card><CardBody className='bg-secondary text-muted text-center'><i>No
                                                        data available</i></CardBody></Card>)
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter className='d-flex align-items-center justify-content-between'>
                                <Link to='/admin/projects-management' className='btn btn-danger'>Back</Link>
                                <Pagination
                                    className={`pagination justify-content-end mb-0 ${Tasks.pageCount == 1 ? 'd-none' : ''}`}
                                    listClassName="justify-content-end mb-0">
                                    <PaginationItem className={Tasks.query.page == 1 ? "disabled" : ""}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleChangePage(1)
                                            }}
                                            tabIndex="-1">
                                            <i className="fas fa-angle-double-left"/>
                                            <span className="sr-only">First</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem className={Tasks.query.page == 1 ? "disabled" : ""}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleChangePage(Tasks.query.page - 1)
                                            }}>
                                            <i className="fas fa-angle-left"/>
                                            <span className="sr-only">Previous</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem className={Tasks.query.page == Tasks.pageCount ? "disabled" : ""}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleChangePage(Tasks.query.page + 1)
                                            }}>
                                            <i className="fas fa-angle-right"/>
                                            <span className="sr-only">Next</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem className={Tasks.query.page == Tasks.pageCount ? "disabled" : ""}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleChangePage(Tasks.pageCount)
                                            }}>
                                            <i className="fas fa-angle-double-right"/>
                                            <span className="sr-only">Last</span>
                                        </PaginationLink>
                                    </PaginationItem>
                                </Pagination>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
            <DetailProject.ModalTask p_id={id} task_id={IDModal} toggleModal={handleToggleModal}
                                     actionState={toggleModal} setActionState={setToggleModal}/>
        </>
    )
}


DetailProject.Task = function Task({Task, toggleModal, dispatch, Query}) {
    const deleteAction = (task_id) => {
        confirmAlert({
            title: "Are you sure want to delete this task?",
            closeOnConfirm: false,
        }).then((confirm) => {
            if (confirm) {
                return destroyTask(task_id);
            } else {
                throw null;
            }
        })
            .then(response => {
                if (response.data.status === 200) {
                    successAlert("The task deleted successfully.");
                    dispatch(fetchTasks(Query));
                } else {
                    errorAlert("Can not deleted task. Please try again.");
                }
            })
            .catch((error) => {
                if (error !== null) {
                    errorAlert("Unable to send request. Please try again later.");
                }
            });
    }
    return (
        <Card className='bg-secondary p-3 mb-4'>
            <h3 className='text-capitalize'>{Task.name}</h3>
            <div className='d-flex'>
                <p className='text-sm'>
                    Effort Task:
                    <b className='ml-2'>{Task.effort_task}</b>
                </p>
                <p className='text-sm ml-auto'>
                    Effort OT:
                    <b className='ml-2'>{Task.effort_OT}</b>
                </p>
                <p className='text-sm ml-auto'>
                    Rate:
                    <b className='ml-2'>{Task.rate}</b>
                </p>
            </div>
            <div style={{position: 'relative'}}>
                <p className='text-sm'>
                    Assigned Person:
                    <b className='ml-2'>{Task.user_name}</b>
                </p>
                <p className='text-sm'>
                    Status:
                    <b className='ml-2 text-capitalize'>{Task.status}</b>
                </p>
                <div style={{position: 'absolute', bottom: '16px', right: '0', cursor: 'pointer'}}>
                    <i className="fas fa-edit text-info mx-2" task_id={Task.id} onClick={toggleModal}></i>
                    <i className="far fa-trash-alt text-danger" onClick={(e) => {
                        e.preventDefault();
                        deleteAction(Task.id);
                    }}></i></div>
            </div>
        </Card>
    )
}

DetailProject.ModalTask = function ModalTask({p_id, task_id = 0, toggleModal, actionState, setActionState}) {
    const [editData, setEditData] = useState({
        name: '',
        user_id: '',
        effort_task: 0,
        effort_OT: 0,
        rate: 1,
    });
    const [allUsers, setAllUsers] = useState([]);
    const [YupObj, setYupObj] = useState({
        name: Yup.string().required('Required Field!'),
        effort_task: Yup.number().required('Required Field!').min(0, 'The value must be greater than 0'),
        effort_OT: Yup.number().required('Required Field!').min(0, 'The value must be greater than 0'),
        rate: Yup.number().required('Required Field!').min(0, 'The value must be greater than 0'),
        user_id: Yup.mixed().required('Required Field!'),
    })
    useEffect(() => {
        getUserByProject(p_id)
            .then(response => {
                setAllUsers(response.data.data);
            })
            .catch();
    }, []);
    useEffect(() => {
        if (task_id != 0) {
            editTask(task_id)
                .then(response => {
                    setEditData({...response.data.data, user_id: allUsers.filter(item => item.value === response.data.data.user_id)});
                    setYupObj({
                        name: Yup.string().required('Required Field!'),
                        effort_task: Yup.number().required('Required Field!').min(0, 'The value must be greater than 0'),
                        effort_OT: Yup.number().required('Required Field!').min(0, 'The value must be greater than 0'),
                        rate: Yup.number().required('Required Field!').min(0, 'The value must be greater than 0'),
                        user_id: Yup.mixed().required('Required Field!'),
                        status: Yup.string().required("Required Field!")
                    })
                }).catch(errors => {
            });
        } else {
            setEditData({
                name: '',
                user_id: '',
                effort_task: 0,
                effort_OT: 0,
                rate: 1,
            });
        }
    }, [task_id, actionState])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: editData,
        validationSchema: Yup.object(YupObj),
        onSubmit: async (values, e) => {
            let objTask = {...values, project_id: +p_id};
            objTask.user_id = values.user_id.value;
            const newAction = !actionState;
            if (task_id == 0) {
                await storeTask(objTask)
            } else {
                await updateTask(task_id, objTask);
            }
            setActionState(newAction);
            e.resetForm(true);
        }
    });

    const handleChangeUser = (obj) => {
        formik.setFieldValue('user_id', obj);
    };
    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={actionState}
            toggle={toggleModal}
        >
            <div className="modal-header">
                <h3 className="modal-title">
                    {task_id == 0 ? 'Add Task' : 'Edit Task'}
                </h3>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={(e) => {
                        formik.resetForm(true);
                        toggleModal(e)
                    }}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <Form onSubmit={formik.handleSubmit}>
                <div className="modal-body">
                    <FormGroup>
                        <Label className="form-control-label">Name Task</Label>
                        <Input className="form-control-alternative" type="text" name="name" placeholder="Task Project"
                               onChange={formik.handleChange}
                               value={formik.values.name}
                        />
                    </FormGroup>
                    {formik.errors.name && formik.touched.name && (
                        <TextAlert text={formik.errors.name}/>
                    )}
                    <FormGroup>
                        <Label className="form-control-label">Effort Task(Hour)</Label>
                        <Input className="form-control-alternative" type="number" name="effort_task"
                               placeholder="Effort Task"
                               onChange={formik.handleChange}
                               value={formik.values.effort_task}
                        />
                    </FormGroup>
                    {formik.errors.effort_task && formik.touched.effort_task && (
                        <TextAlert text={formik.errors.effort_task}/>
                    )}
                    <FormGroup>
                        <Label className="form-control-label">Effort OT(Hour)</Label>
                        <Input className="form-control-alternative" type="number" name="effort_OT"
                               placeholder="Effort OT"
                               onChange={formik.handleChange}
                               value={formik.values.effort_OT}
                        />
                    </FormGroup>
                    {formik.errors.effort_OT && formik.touched.effort_OT && (
                        <TextAlert text={formik.errors.effort_OT}/>
                    )}
                    <FormGroup>
                        <Label className="form-control-label">Rate</Label>
                        <Input className="form-control-alternative" type="number" name="rate" placeholder="Rate Task"
                               onChange={formik.handleChange}
                               value={formik.values.rate}
                        />
                    </FormGroup>
                    {formik.errors.rate && formik.touched.rate && (
                        <TextAlert text={formik.errors.rate}/>
                    )}
                    <FormGroup>
                        <Label className="form-control-label">Assigned Person</Label>
                        <Select name="user_id" options={allUsers} className="basic-multi-select"
                                classNamePrefix="select" onChange={handleChangeUser}
                                value={formik.values.user_id}
                        />
                    </FormGroup>
                    {formik.errors.user_id && formik.touched.user_id && (
                        <TextAlert text={formik.errors.user_id}/>
                    )}
                    {
                        task_id != 0 ? (
                            <>
                                <FormGroup>
                                    <Label className="form-control-label">Status</Label>
                                    <select name="status" onChange={formik.handleChange} value={formik.values.status}
                                            className='form-control-alternative form-control text-capitalize'>
                                        {
                                            STATUS.map((item, key) => {
                                                return (<option value={item} key={key}>{item}</option>)
                                            })
                                        }
                                    </select>
                                </FormGroup>
                                {formik.errors.status && formik.touched.status && (
                                    <TextAlert text={formik.errors.status}/>
                                )}
                            </>
                        ) : null
                    }
                </div>
                <div className="modal-footer justify-content-between">
                    <Button
                        color="light"
                        data-dismiss="modal"
                        type="button"
                        onClick={(e) => {
                            formik.resetForm(true);
                            toggleModal(e)
                        }}
                    >
                        Close
                    </Button>
                    <Button color="primary" type="submit">
                        {task_id == 0 ? 'Save Task' : 'Update Task'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
