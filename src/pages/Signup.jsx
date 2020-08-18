import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Signup() {
    return (
        <Container>
            <Row className="justify-content-center component-padding">
                <Col md="auto" xs="auto">
                    <Form action="/signup" method="POST">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control className="form-control" type="email" placeholder="Enter email" name="email" required="true" autoFocus />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className="form-control" type="password" placeholder="Enter password" name="password" required="true"/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword2">
                            <Form.Control className="form-control" type="password" placeholder="Enter password again" required="true"/>
                        </Form.Group>

                        <Button variant="secondary" type="submit">
                            Sign Up
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

export default Signup;