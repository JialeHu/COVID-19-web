import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import APIs from "../data/APIs";

function Doc() {

    function generateJumbotron() {
        const jumbotrons = [];
        APIs.forEach(api => {
            jumbotrons.push(
                <Jumbotron className="jumbotron">
                    <h1>{api.title}</h1>
                    <p>{api.description}</p>
                    <h6><b>URL: </b>{api.url}</h6>
                    <p><b>Method: </b>{api.method}</p>
                </Jumbotron>
            );
        });
        return jumbotrons;
    }

    return (
        <Container className="top-padding">
            <p>{"Replace <> with your query parameter."}</p>
            <p>{"Signup to get your API key."}</p>
            <p>{"Data are returned in JSON."}</p>
            {generateJumbotron()}
        </Container>
    );
}

export default Doc;