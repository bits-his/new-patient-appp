import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const FORM_LIST = ['SERVICES', 'DEPOSIT'];

function LinkForms() {
  const [, setLinkage] = useState();
  return (
    <div>
      <div className="row">
        <Typeahead
          id="head"
          align="justify"
          // labelKey="head"
          options={FORM_LIST}
          onChange={(val) => {
            if (val) setLinkage('debit', val[0]['head']);
          }}
          // onInputChange={head => setSubHead(head)}
          // allowNew
        />
      </div>
    </div>
  );
}

export default LinkForms;
