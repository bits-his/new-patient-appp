import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Table, Container, UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { apiURL } from '../../../../redux/actions';
import moment from 'moment'
import DaterangeSelector from '../../../comp/components/DaterangeSelector';
import Hematology from '../LabsTracking/Hematology';
import BackButton from '../../../comp/components/BackButton';

function WorkList({ start, end }) {
    const [work, setWork] = useState("Work List")
    const [results, setResults] = useState([])
    let today = moment().format("YYYY-MM-DD");
    const [range, setRange] = useState({ from: today, to: today });

    const handleRangeChange = ({ target: { name, value } }) => {
        setRange((p) => ({ ...p, [name]: value }));
    };


    const getLabProccess = useCallback(
        () => {
            fetch(
                `${apiURL()}/lab/proccess?from=${range.from}&to=${range.to}&type=select`
            )
                .then((raw) => raw.json())
                .then((data) => {
                    if (data.success && data.results) {
                        // setResults(data.results);
                        let tempList = [];
                        data.results.forEach(item => {
                            let itemDoesNotExist = tempList.findIndex(a => a.patient_id===item.patient_id && a.name===item.name&&a.label_name===item.label_name) === -1
                            if(itemDoesNotExist) {
                                tempList.push(item)
                            } 
                            // else {
                            //     tempList.push(item)
                            // }
                        })

                        setResults(tempList)
                    }
                })
                .catch((err) => console.log(err));
        },[range.from,range.to]

    );

    useEffect(
        () => {
            getLabProccess();
        },
        [getLabProccess]
    );


    return (
        <>
            {/* {JSON.stringify(results)} */}
            <div>
                <BackButton />
                <Card >
                    <CardHeader className="h6 text-center">{work}</CardHeader>
                    <CardBody>
                        {/* <div>
                            <Row>
                                <Col md={4}>
                                    <Label>Select Department</Label>
                                    <Input type="select">
                                        <option>--select--</option>
                                        <option>All Test</option>
                                        <option >Hematology</option>
                                        <option>Chemical Pathology</option>
                                        <option>Microbiology</option>
                                        <option>Radiology</option>

                                    </Input>
                                </Col>
                                <Button onClick={() => setWork("Hematology")}>jkj</Button>
                            </Row>
                        </div> */}
                        <UncontrolledButtonDropdown>
                            <DropdownToggle caret color="info" size="sm">
                                Select Department
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => setWork("Work List")}>All Test</DropdownItem>
                                <DropdownItem onClick={() => setWork("Hematology")}>Hematology</DropdownItem>
                                <DropdownItem onClick={() => setWork("Chemical Pathology")}>Chemical Pathology</DropdownItem>
                                <DropdownItem onClick={() => setWork("Microbiology")}>Microbiology</DropdownItem>
                                <DropdownItem onClick={() => setWork("Radiology")} >Radiology</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        {work === "Work List" ? (<>
                        <DaterangeSelector
                            from={range.from}
                            to={range.to}
                            handleChange={handleRangeChange}
                        />
                            <Table striped size="sm" bordered responsive>
                                <thead>
                                    <tr>
                                        <th>Patient No</th>
                                        <th>Barcode</th>
                                        <th>Patient Name</th>
                                        <th>Age</th>
                                        <th>Sex</th>
                                        <th>Test</th>
                                        <th>Test Status</th>
                                        <th>Sample</th>
                                        <th>Collection Date</th>
                                        <th>Result Date</th>
                                        <th>Delay</th>
                                        <th>Printed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((item) => (
                                        <tr>
                                            <td>{item.patient_id}</td>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>{moment().diff(item.DOB, 'years')}</td>
                                            <td>{item.Gender}</td>
                                            {/* <td>{item.description}</td> */}
                                            <td>{item.selectable==='not allowed' ? item.label_name : item.description}</td>
                                            <td>{item.status}</td>
                                            <td>{item.specimen}</td>
                                            <td>{item.sample_collected_at}</td>
                                            <td>{item.result_at}</td>
                                            <td>{item.result_at ? `${moment(item.created_at).diff(item.result_at, 'days')} D` : null}</td>
                                            <td>{item.printed_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>) : work !== "Work List" ? (<Hematology department={work}  />) :null}
                    </CardBody>
                </Card>
            </div>


        </>
    );
}


export default WorkList;