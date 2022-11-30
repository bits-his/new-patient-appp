import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button, Card,CardBody,CardHeader,Row, Table } from 'reactstrap'
import { apiURL } from '../../../redux/actions';
import DaterangeSelector from '../../comp/components/DaterangeSelector'
import SelectInput from '../../comp/components/SelectInput'
import { formatNumber } from '../../utils/helpers';

function ReportsContainer(){
    const startOfMonth = moment()
        .startOf('month')
        .format('YYYY-MM-DD');
    const endOfMonth = moment()
        .endOf('month')
        .format('YYYY-MM-DD');
    const facilityId = useSelector(state => state.auth.user.facilityId)

    const [, setFinancialStatement] = useState([])
    const [formattedFinancialStatement, setFormattedFinancialStatement] = useState([])
    const [range, setRange] = useState({ from: startOfMonth, to: endOfMonth})

    // const getAccMainHeads = () => {
    //     fetch(`${apiURL()}/account/main-heads/${facilityId}`)
    //     .then(raw => raw.json())
    //     .then(data => {
    //         // if(data.success){
    //             setFinancialStatement(data.results)
    //         // }
    //     })
    //     .catch(err => console.log(err))
    // }

    const getFinancialPosition = useCallback(() => {
        fetch(`${apiURL()}/account/report/financial-statement/${range.from}/${range.to}/${facilityId}`)
        .then(raw => raw.json())
        .then(data => {
            if(data.success){
                setFinancialStatement(data.results)
                let final = {}
                data.results.forEach(item => {
                    if(Object.keys(final).includes(item.description)){
                        final[item.description] = [...final[item.description], item]
                    } else {
                        final[item.description] = [item]
                    }
                })

                Object.keys(final).forEach(head => {
                    final[head] = [...final[head], { des: `Total ${head}`, amount: final[head].reduce((a,b) => a + parseInt(b.amount), 0)}]
                })

                setFormattedFinancialStatement(final)
            }
        })
        .catch(err => console.log(err))
    }, [range.from, range.to, facilityId])

    const handleRangeChange = ({target:{name,value}}) => {
        setRange(p => ({ ...p, [name]: value }))
    }

    useEffect(() => {
        getFinancialPosition()
    }, [getFinancialPosition])

    return (
        <Card>
            <CardHeader className='h6 text-center'>Account Reports</CardHeader>
            <CardBody>
                <DaterangeSelector from={range.from} to={range.to} handleChange={handleRangeChange} />
                <Row className=''>
                    <SelectInput label='Select Report Type' options={['Trial Balance', 'Statement of Financial Position', 'Statement of Profit or Loss']} />
                    <div className='offset-md-4'>
                        <Button color='primary'>Export/Download</Button>
                    </div>
                </Row>
                {/* {JSON.stringify({financialState,facilityId})} */}
                <Table striped size='sm'>
                    <thead>
                        <tr>
                            <th className='text-center'>Description</th>
                            <th className='text-center'>Debit</th>
                            <th className='text-center'>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(formattedFinancialStatement).map((head) => (
                                <>
                                    <tr>
                                        <td className='font-weight-bold' colSpan={3}><u>{head}</u></td>
                                    </tr>
                                    {formattedFinancialStatement[head].map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.des}</td>
                                            <td className='text-right'>{item.amount > 0 ? formatNumber(Math.abs(item.amount)) : '-'}</td>
                                            <td className='text-right'>{item.amount < 0 ? formatNumber(Math.abs(item.amount)) : '-'}</td>
                                        </tr>
                                    ))}
                                </>
                            ))
                        }
                        {/* {
                            financialState.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.des}</td>
                                    <td className='text-right'>{item.amount > 0 ? Math.abs(item.amount) : '-'}</td>
                                    <td className='text-right'>{item.amount < 0 ? Math.abs(item.amount) : '-'}</td>
                                </tr>
                            ))
                        } */}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    )
}

export default ReportsContainer