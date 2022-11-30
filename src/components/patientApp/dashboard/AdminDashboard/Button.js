import React from 'react'

export default function Button({ onClick, btnText, icon, style }) {
    return (
        <div>
            <button className='action-btn shadow mt-3' style={style} onClick={onClick}>{icon}{' '}{btnText}</button>
        </div>
    )
}
