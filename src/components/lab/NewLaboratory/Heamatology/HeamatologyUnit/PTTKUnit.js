import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

export default class PTTKUnit extends Component {
  render() {
    // const {hb, pcv, rbc, mcv, mchc, monocoytse, wbc, neutropils, lymphoytes, ecsinophils, basophils, others} = this.props
    return (
      <>
            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox"
                  name = "control1"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.control1} 
                /> Control
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "sample1"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.sample1}
                /> Sample
              </Label>
            </FormGroup>
            <br />
            
            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "ratio"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.ratio}
                /> Ratio
              </Label>
            </FormGroup>
            </>
         )
    }
}