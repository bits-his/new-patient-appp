import React from 'react'
import { CustomTable } from "../../comp/components"

export default props => {
    const fields = [
        {
            title: 'GRN No.',
            value: 'grn_no'
        },
        {
            title: 'Date',
            value: 'created_at'
        },
    ]
    return (
        <div>
            <CustomTable fields={fields} />
        </div>
    )
}