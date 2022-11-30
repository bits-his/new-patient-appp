import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Table, Container } from 'reactstrap';
import { apiURL } from '../../../../redux/actions';
import moment from 'moment'
import DaterangeSelector from '../../../comp/components/DaterangeSelector';
import Scrollbar from '../../../comp/components/Scrollbar';

function AllTest({ start, end }) {
    let today = moment().format("YYYY-MM-DD");

    const [results, setResults] = useState([])
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
                        setResults(data.results);
                    }
                })
                .catch((err) => console.log(err));
        },
        [start, end]
    );

    useEffect(
        () => {
            getLabProccess();
        },
        [getLabProccess]
    );



    // const getDelay = (a,b) => {
    //    let delayInDays = moment(item.result_at).diff(item.created_at, 'days')
    //    let delayInHours  
    // }

    return (
        <>
            {/* {JSON.stringify(results)} */}
            <DaterangeSelector
                from={range.from}
                to={range.to}
                handleChange={handleRangeChange}
            />
            <Scrollbar height={400}>
                <Table striped size="sm" bordered responsive>
                    <thead>
                        <tr>
                            <th>Patient No</th>
                            <th>Acc No</th>
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
                                <td>{item.booking_no}</td>
                                <td>{item.name}</td>
                                <td>{moment().diff(item.DOB, 'years')}</td>
                                <td>{item.Gender}</td>
                                <td>{item.description}</td>
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
            </Scrollbar>

        </>
    );
}


export default AllTest;