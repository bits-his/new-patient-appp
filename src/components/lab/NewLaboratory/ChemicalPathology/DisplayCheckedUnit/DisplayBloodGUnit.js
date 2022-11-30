import React, {Component} from 'react'

export default class DisplayBloodGUnit extends Component{
    render(){
      const {fasting, random} = this.props
        return(
            <>
            {fasting ?
                <div>
                  <ul>
                  <li>Fasting</li>
                </ul> 
              </div> 
              : null
              }

            {random ? 
              <div>
                <ul>
                  <li>Random</li>
                </ul> 
              </div> 
              : null
            } 
        </>
        )
    }
}