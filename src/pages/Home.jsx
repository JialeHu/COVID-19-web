import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GlobalPlot from "../components/GlobalPlot";


function Home() {

    return (
        <Container fluid>
            <Row className="justify-content-center" id="section1">
                <Col md="auto" xs="auto">
                    <h1>Intro</h1>
                </Col>
            </Row>

            <Row className="justify-content-center" id="section2">
                <Col md="auto" xs="auto">
                    <h1>Global Cases</h1>
                </Col>
            </Row>
            <Row className="justify-content-center text-center" id="section2">
                <Col xs="10" lg="8">
                    <GlobalPlot />
                </Col>
            </Row>

            <Row className="justify-content-center" id="section3">
                <Col md="auto" xs="auto">
                    <h1>Cases by Country and Region</h1>
                </Col>
            </Row>
            <Row className="justify-content-center text-center" id="section3">
                <Col xs="10" lg="8">
                    <h1>Selector</h1>
                    <hr />
                    <h1>Another plot</h1>
                </Col>
            </Row>

            <Row className="justify-content-center text-center" id="section4">
                <Col xs="10" lg="8">
                    <h1>Link to api and signup</h1>
                </Col>
            </Row>

            <Row className="justify-content-center text-center" id="section5">
                <Col xs="10" lg="8">
                    <h1>Data source</h1>
                </Col>
            </Row>

        </Container>
    );
}

export default Home;