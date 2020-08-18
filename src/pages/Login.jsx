import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login() {
    return (
        <Container>
            <Row className="justify-content-center component-padding">
                <Col md="auto" xs="auto">
                    <Form action="/login" method="POST">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control className="form-control" type="email" placeholder="Enter email" name="email" required="true" autoFocus />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className="form-control" type="password" placeholder="Password" name="password" required="true" />
                        </Form.Group>

                        <Button variant="secondary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
            <hr />
            <Row className="justify-content-center component-padding">
                <Col md="auto" xs="auto">
                    <Button className="ml" variant="secondary" type="button" href="/auth/google">
                        <i class="fab fa-google" />
                        {" Sign In with Google"}
                    </Button>
                </Col>
            </Row>

        </Container>
    );
}

export default Login;