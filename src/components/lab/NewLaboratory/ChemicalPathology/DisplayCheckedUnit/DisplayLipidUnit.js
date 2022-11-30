import React, {Component} from 'react'
// import { CardHeader } from 'reactstrap'

export default class DisplayLipidUnit extends Component{
    render(){
      const {tchol, hdl, trig, idl} = this.props
        return(
            <>
            {tchol ?
                <div>
                  <ul>
                  <li>T.Chol</li>
                </ul> 
              </div> 
              : null
              }

            {hdl ? 
              <div>
                <ul>
                  <li>HDL</li>
                </ul> 
              </div> 
              : null
            }

            {trig ?       
              <div>
                <ul>
                  <li>TRIG</li>
                </ul> 
              </div> 
              : null
            }

            {idl ?
              <div>
                <ul>
                  <li>IDL</li>
                </ul> 
              </div> 
              : null 
            } 
        </>
        )
    }
}