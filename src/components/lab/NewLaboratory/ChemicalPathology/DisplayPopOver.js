import React, {Component} from 'react'
import PopOver from './PopOvers/UCEPopOver'
import {CardHeader, CardBody} from 'reactstrap'

export default class DisplayPopOver extends Component{
    render(){
        return(
            <>
                <CardHeader>Chemical Pathology Department</CardHeader>
                <CardBody>
                  {this.props.uecCheck ? <PopOver /> : null}
                  {this.props.bloodGlucoseCheck ? <PopOver /> : null}
                  {this.props.bormonesCheck ? <PopOver /> : null}
                  {this.props.lipidProfileCheck ? <PopOver /> : null}
                </CardBody>
            </>
        )
    }
}