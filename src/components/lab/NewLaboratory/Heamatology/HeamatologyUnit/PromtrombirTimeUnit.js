import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

export default class PromtrombirTimeUnit extends Component {
  render() {
    // const {hb, pcv, rbc, mcv, mchc, monocoytse, wbc, neutropils, lymphoytes, ecsinophils, basophils, others} = this.props
    return (
      <>
            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox"
                  name = "control"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.control} 
                /> Control
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "sample"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.sample}
                /> Sample
              </Label>
            </FormGroup>
            </>
         )
    }
}