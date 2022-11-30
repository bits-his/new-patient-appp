import React, { useState } from 'react'
import { Input, Col, Row } from 'reactstrap'
import Autocomplete from '../../../components/UI/Autocomplete'
import SearchBar from '../../../components/UI/SearchBar'
import Drugs from './Drugs'
import DrugsCart from './DrugsCart'
export default function Index() {

    const drug = [
        {
            drugName: 'Paracetamol',
            quantity: 0,
            price: 100,
            status: false
        },
        {
            drugName: 'Gestid',
            quantity: 0,
            price: 500,
            status: false
        },
        {
            drugName: 'Boska',
            quantity: 0,
            price: 200,
            status: false
        },
    ]

    const [itemList, setItemList] = useState(drug)

    //search//////////
    let [search, setSearch] = useState('')

    let rows = []
    itemList.forEach(i => {
        if (
            i.drugName &&
            i.drugName.toLowerCase().indexOf(search.toLowerCase()) === -1
        ) {
            return
        }
        rows.push(i)
    })
/////////////
    function increment(index) {
        let newArr = []
        rows.forEach((it, idx) => {
            if (index === idx) {
                newArr.push({ ...it, quantity: it.quantity + 1, status: true })
            } else {
                newArr.push(it)
            }
        })
        setItemList(newArr)
    }

    function decrement(index) {
        let newArr = []
        rows.forEach((it, idx) => {
            if (index === idx) {
                newArr.push({ ...it, quantity: it.quantity - 1, status: true })
            } else {
                newArr.push(it)
            }
        })
        setItemList(newArr)
    }
    return (
        <>
            {/* <Row style={{ marginLeft: 10, marginRight: 10 }}>
                <Col md="6">
                    <SearchBar placeholder="Search item name" filterText={search} onFilterTextChange={(v) => setSearch(v)} />
                    <Drugs itemList={rows} increment={increment}
                        decrement={decrement} />
                </Col>
                <Col md="6">
                    <DrugsCart />
                </Col>
            </Row> */}
        </>
    )
}