import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Label } from 'evergreen-ui/commonjs/typography';

export default class ContinueReg extends Component {
  render() {
    return (
      <FormGroup>
        <Label>Specimen</Label>
        <Typeahead
          allowNew={true}
          multiple
          options={['Blood', 'Swab', 'Urine']}
          onChange={(text) => console.log(text)}
          onInputChange={(text) => console.log(text)}
        />
      </FormGroup>
    );
  }
}
