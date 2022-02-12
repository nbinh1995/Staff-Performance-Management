import React from "react";

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col,
} from "reactstrap";
import {useFormik} from 'formik';
import * as Yup from "yup";
import {loginSuccess, loginFailure} from './authSlice';
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router";
import {login} from './authService';
import {history} from "../../helper/history";
import MASTER from "../../constants/master";
import Overlay from "../../components/Overlay/Overlay";
import jwt_decode from "jwt-decode";

export default function Login() {
    const dispatch = useDispatch();
    const location = useLocation();
    const auth = useSelector(state => state.auth);
    const isLoading = useSelector(state => state.app.isLoading);


    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email format")
                .required("Required Field!"),
            password: Yup.string()
                .min(8, "Minimum 8 characters")
                .required("Required Field!"),
        }),
        onSubmit: values => {
            const from = location.state || {from: {pathname: "/"}};
            //dispatch(loginRequest({email: values.email, token: ''}));
            login({...values}).then(({data}) => {
                dispatch(loginSuccess({user: {email: values.email, token: data.access_token}, from: from}));
                return data.access_token;
            }).then((token) => {
                let role = jwt_decode(token).s ?? null;
                if (role === MASTER.ROLE.ADMIN) {
                    history.push(auth.from);
                } else if (role === MASTER.ROLE.LEADER) {
                    history.push({pathname: '/admin/projects-management'});
                } else {
                    history.push({pathname: '/admin/profile'});
                }
            }).catch(() => {
                    dispatch(loginFailure());
                });
        },
    });

    return (
        <>
            <Col lg="5" md="7">
                {isLoading && <Overlay />}
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <small>Sign in with credentials</small>
                        </div>
                        <Form role="form" onSubmit={formik.handleSubmit}>
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-email-83"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        autoComplete="new-email"
                                        name="email"
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                    />
                                </InputGroup>
                                {formik.errors.email && formik.touched.email && (
                                    <p className='text-red'>{formik.errors.email}</p>
                                )}
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        name="password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                    />
                                </InputGroup>
                                {formik.errors.password && formik.touched.password && (
                                    <p className='text-red'>{formik.errors.password}</p>
                                )}
                            </FormGroup>
                            <div className="text-center">
                                <Button className="my-4" color="primary" type="submit">
                                    Sign in
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    )
}
