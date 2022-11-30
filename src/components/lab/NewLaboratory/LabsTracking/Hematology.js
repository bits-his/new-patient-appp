import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Table, Container } from 'reactstrap';
import moment from 'moment'
import { apiURL } from '../../../../redux/actions';
import DaterangeSelector from '../../../comp/components/DaterangeSelector';
import SearchBar from '../../../record/SearchBar';
import Scrollbar from '../../../comp/components/Scrollbar';

function Hematology({ start, end, department }) {
    let today = moment().format("YYYY-MM-DD");

    const [results, setResults] = useState([])
    const [results2, setResults2] = useState([])
    const [range, setRange] = useState({ from: today, to: today });
    const [searchTerm,
        setSearchTerm] = useState('');
    let labResultSearchRef = null;
    const handleRangeChange = ({ target: { name, value } }) => {
        setRange((p) => ({ ...p, [name]: value }));
    };

    const renderList = (list1, list2) => {
        const list = list2.length > 0 && searchTerm.length > 4 ? list2 : list1;
        console.log({ list1 });
        console.log({ list2 });
        return list && list.map((item) => (
            <tr>
                <td>{item.patient_id}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{moment().diff(item.DOB, 'years')}</td>
                <td>{item.Gender}</td>
                <td>{item.selectable==='not allowed' ? item.label_name : item.description}</td>
                <td>{item.status}</td>
                <td>{item.specimen}</td>
                {/* <td>{item.created_at}</td>
                <td>{item.result_at}</td> */}
                <td>{item.result_at ? `${moment(item.created_at).diff(item.result_at, 'days')} D` : null}</td>
                <td>{item.department_head}</td>
            </tr>
        ))
    }

    const getLabProccess = useCallback(() => {
        fetch(
            `${apiURL()}/lab/Select/Department/${department}/${range.from}/${range.to}`
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
    }, [department, range.from, range.to]);


    useEffect(() => {
        getLabProccess()
    }, [getLabProccess]);

    const searchChange = useCallback(() => {
        const new_res = results && results.length && searchTerm.length > 3 && results.filter(item => item.patient_id.toString().includes(searchTerm)
        )

        setResults2(new_res ? new_res : [])
    }, [searchTerm, results])
    useEffect(() => {
        searchChange()
    }, [searchChange])
    console.log({ results })
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
                <SearchBar
                    _ref={labResultSearchRef}
                    filterText={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.terget.value)
                    }}
                    onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
                    placeholder="Search for a test by patient, test, date or by scanning barcode"
                />
            </div>
            <Scrollbar height={400}>
                <div>
                    {/* {JSON.stringify(results)} */}
                    <Table striped size="sm" bordered responsive>
                        <thead>
                            <tr>
                                <th>Patient No</th>
                                <th>Barcode</th>
                                <th>Patient Name</th>
                                <th>DOB</th>
                                <th>Gender</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Sample</th>
                                <th>Delay</th>
                                <th>department_head </th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderList(results, results2)}
                        </tbody>
                    </Table>
                </div>
            </Scrollbar>
        </div>
    )
}

export default Hematology

