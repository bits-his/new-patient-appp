import React from 'react'

export default function ShortcutKeys() {
    return (
      <div className="d-flex">
        <p className="my-0 mr-2">
          <u>Shortcut Keys</u>:
        </p>
        <span className="my-0 text-success mr-2">
          "Press Enter Key"= Add to Cart
        </span>
        {/* {edit ? ( */}
          <span className="my-0 text-danger mr-2">"Press E Key"= Edit</span>
        {/* ) : null} */}
        <span className="my-0 text-info">"Press F2 Key"= Checkout</span>
      </div>
    );
  }
  