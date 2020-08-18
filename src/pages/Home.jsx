import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GlobalPlot from "../components/GlobalPlot";


function Home() {

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col md="auto" xs="auto">
                    <h1>Global Data</h1>
                </Col>
            </Row>

            <Row className="justify-content-center text-center">
                <Col xs="10" lg="8">
                    <GlobalPlot />
                </Col>
            </Row>
            <hr />

        </Container>
    );
}

export default Home;