import React, { Component } from 'react';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

export default class FullBloodCountUnit extends Component {
  render() {
    // const {hb, pcv, rbc, mcv, mchc, monocoytse, wbc, 
    //       neutropils, lymphoytes, ecsinophils, basophils, others} = this.props
    return (
      <>
            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox"
                  name = "hb"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.hb} 
                /> Hb
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "pcv"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.pcv}
                /> PCV
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "rbc"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.rbc}
                /> RBC
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "mcv"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.mcv}
                /> MCV
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "mchc"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.mchc}
                /> MCHC
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "mch"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.mch}
                /> MCH
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "wbc"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.wbc}
                /> WBC
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "neutropils"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.neutropils}
                /> Neutropils
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "lymphoytes"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.lymphoytes}
                /> Lymphoytes
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "ecsinophils"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.ecsinophils}
                /> Ecsinophils
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "basophils"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.basophils}
                /> Basophils
              </Label>
            </FormGroup>
            <br />

            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "monocoytse"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.monocoytse}
                /> Monocoytse
              </Label>
            </FormGroup>
            <br />
            
            <FormGroup check>
              <Label check>
                <Input 
                  type="checkbox" 
                  name = "others"
                  onChange = {this.props.handleCheck}
                  checked = {this.props.others}
                /> Others
              </Label>
            </FormGroup>
      </>
    );
  }
}
