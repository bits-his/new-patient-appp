import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Table, Container } from 'reactstrap';
import moment from 'moment'
import { apiURL } from '../../../../redux/actions';
import DaterangeSelector from '../../../comp/components/DaterangeSelector';
import SearchBar from '../../../record/SearchBar';
import Scrollbar from '../../../comp/components/Scrollbar';
// import { apiURL } from '../../../redux/actions';
// import DaterangeSelector from '../../comp/components/DaterangeSelector';
// import SearchBar from '../../record/SearchBar';
// import Scrollbar from '../../comp/components/Scrollbar';

function RadiologyTest({ start, end }) {
    let today = moment().format("YYYY-MM-DD");

    const [results, setResults] = useState([])
    const [range, setRange] = useState({ from: today, to: today });

    const handleRangeChange = ({ target: { name, value } }) => {
        setRange((p) => ({ ...p, [name]: value }));
    };



    const getLabProccess = useCallback(
        () => {
            fetch(
                `${apiURL()}/lab/proccess?from=${range.from}&to=${range.to}&type=department`
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

    return (
        <div>
            <div className="mx-1 mt-1">
                <DaterangeSelector
                    from={range.from}
                    to={range.to}
                    handleChange={handleRangeChange}
                    // showLabel={false}
                    size="sm"
                />
                {/* {JSON.stringify(comments)} */}
                {/* <DaterangeSelector /> */}
                <SearchBar
                    // _ref={labResultSearchRef}
                    // filterText={searchTerm}
                    // onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
                    placeholder="Search for a test by patient, test, date or by scanning barcode"
                />
            </div>
            <Scrollbar height={400}>
                <div>
                    <Table bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Patient No</th>
                                <th>Patient Name</th>
                                <th>Test</th>
                                <th>Test Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item) => (
                                <tr>
                                    <td>{item.patient_id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Scrollbar>
        </div>
    )
}

export default RadiologyTest

