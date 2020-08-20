import React, { useState } from "react";
import {Link} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import GlobalPlot from "../components/GlobalPlot";
import CountrySelector from "../components/CountrySelector";
import CountryPlot from "../components/CountryPlot";

function Home() {
    const defaultCountry = "US"
    const [country, setCountry] = useState(defaultCountry);

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
            <Row className="justify-content-center text-center bottom-padding" id="section2">
                <Col xs="10" lg="8">
                    <GlobalPlot />
                </Col>
            </Row>

            <Row className="justify-content-center" id="section3">
                <Col md="auto" xs="auto">
                    <h1>Current Cases by Country and Region</h1>
                </Col>
            </Row>
            <Row className="justify-content-center text-center bottom-padding" id="section3">
                <Col xs="8" lg="4">
                    <CountrySelector setCountry={setCountry} defaultCountry={defaultCountry} />
                    <hr />
                    <CountryPlot country={country}/>
                </Col>
            </Row>

            <Row className="justify-content-center text-center bottom-padding" id="section4">
                <Col xs="10" lg="8">
                    <h1>Check Out API Documentation and Signup for FREE!</h1>
                    <Link to="/doc">
                        <Button className="button-padding" variant="outline-dark" size="lg">API Doc</Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="button-padding" variant="outline-dark" size="lg">Signup</Button>
                    </Link>
                </Col>
            </Row>

            <Row className="justify-content-center text-center" id="section5">
                <Col xs="10" lg="8">
                    <p>Data Source: COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University</p>
                    <a className="link-font" href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>
                    <p>Copyright ⓒ {new Date().getFullYear()}</p>
                </Col>
            </Row>

        </Container>
    );
}

export default Home;