import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

function CountrySelector(props) {
    const [countryList, setCountryList] = useState([]);

    function fetchCountryList() {
        const apiUrl = "/api/country_region_list?apikey=DH2VFXQ-C564NRA-GV6C6XB-W6YPCYQ";
        fetch(apiUrl).then(response => response.json()).then(data => {
            const countryList = [];
            for (var i = 0; i < data.length; i++) {
                let country = data[i]._id;
                countryList.push(<option key={i} value={country}>{country}</option>);
            }
            // data.forEach(element => {
            //     countryList.push(<option>{element._id}</option>);
            // });
            setCountryList(countryList);
        });
    }

    function handleSelect(e) {
        props.setCountry(e.target.value);
        console.log("Selector setCountry");
    }

    if (countryList.length === 0) {
        fetchCountryList();
    }

    return (
        countryList.length === 0 ? <Spinner animation="border"/> :
        <Form.Group controlId="countryForm.ControlSelect">
            <Form.Label>Select Country or Region</Form.Label>
            <Form.Control as="select" custom onChange={handleSelect} defaultValue={props.defaultCountry}>
                {countryList}
            </Form.Control>
        </Form.Group>
    );
}

export default CountrySelector;