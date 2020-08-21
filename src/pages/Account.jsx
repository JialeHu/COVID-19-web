import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

function Account() {
    const [apiKey, setApiKey] = useState("Loading ...");
    const [apiCount, setApiCount] = useState("Loading ...");

    function fetchApiKey() {
        fetch("/apikey").then(res => res.text()).then(text => {
            setApiKey(text);
        });
    }

    function fetchApiCount() {
        fetch("/apicount").then(res => res.text()).then(text => {
            setApiCount(text);
        });
    }

    useEffect(() => {
        fetchApiKey();
        fetchApiCount();
    });

    return (
        <Container className="top-padding">
            <Row className="justify-content-center top-padding">
                <InputGroup size="lg">
                    <InputGroup.Prepend className="input-prepend">
                        <InputGroup.Text id="inputGroup-sizing-lg">Your API KEY</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control aria-label="Large" aria-describedby="inputGroup-sizing-sm" value={apiKey} readOnly/>
                </InputGroup>
            </Row>

            <Row className="justify-content-center top-padding">
                <InputGroup size="lg">
                    <InputGroup.Prepend className="input-prepend">
                        <InputGroup.Text id="inputGroup-sizing-lg">Your API Request Counts</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control aria-label="Large" aria-describedby="inputGroup-sizing-sm" value={apiCount} readOnly/>
                </InputGroup>
            </Row>

            <Row className="justify-content-center top-padding">
                <h6>Any Issue? We Appreciate Your Feedback!</h6>
            </Row>
            <Row className="justify-content-center top-padding">
                <p>Contact Us by <a className="link-font" href="mailto: hjljjdd@gmail.com?subject=COVID19 API Feedback">Sending Email</a></p>
            </Row>
        </Container>
    );
}

export default Account;