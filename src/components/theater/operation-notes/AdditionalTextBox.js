import React, { useState } from 'react';
import { TagInput } from 'evergreen-ui';

export default function AdditionalTextBox({ 
    name, 
    handleAdd, 
    handleRemove 
}) {
    const [ values, setValues ] = useState([]);
    return (
        <TagInput
            inputProps={{ placeholder: 'Add others...' }}
            values={values}
            onChange={values => setValues(values)}
            onAdd={value => handleAdd(name, value)}
            onRemove={value => handleRemove(name, value)}
        />
       
    )
}