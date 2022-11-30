import React, {Component} from 'react'
// import {CardHeader} from 'reactstrap'

export default class DisplayUecUnit extends Component{
    render(){
        const {urea, nA, k, hco3, creatinine} = this.props
        return(
            <>     
                {urea ?
                  <div>
                    <ul>
                    <li>Urea</li>
                  </ul> 
                </div> 
                : null
                }

              {nA ? 
                <div>
                  <ul>
                    <li>NA</li>
                  </ul> 
                </div> 
                : null
              }

              {k ?       
                <div>
                  <ul>
                    <li>K</li>
                  </ul> 
                </div> 
                : null
              }

              {hco3 ?       
                <div>
                  <ul>
                    <li>HCO3</li>
                  </ul> 
                </div> 
                : null
              }

              {creatinine ?
                <div>
                  <ul>
                    <li>Creatinine</li>
                  </ul> 
                </div> 
                : null 
              } 
            </>
        )
    }
}