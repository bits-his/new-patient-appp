import React, {Component} from 'react'

export default class DisplayFullBloodCountUnit extends Component{
render(){
    const {hb, pcv, rbc, mcv, mchc, monocoytse, wbc, mch, neutropils, 
            lymphoytes, ecsinophils, basophils, others} = this.props
    return(
        <>
            {hb ?
                <div>
                  <ul>
                  <li>HB</li>
                </ul> 
              </div> 
              : null
              }

            {pcv ? 
              <div>
                <ul>
                  <li>PCV</li>
                </ul> 
              </div> 
              : null
            }

            {rbc ?       
              <div>
                <ul>
                  <li>RBC</li>
                </ul> 
              </div> 
              : null
            }

            {mcv ?
              <div>
                <ul>
                  <li>MCV</li>
                </ul> 
              </div> 
              : null 
            } 

            {mchc ?
              <div>
                <ul>
                  <li>MCHC</li>
                </ul> 
              </div> 
              : null 
            } 

            {mch ?
              <div>
                <ul>
                  <li>MCH</li>
                </ul> 
              </div> 
              : null 
            } 

            {monocoytse ?
              <div>
                <ul>
                  <li>Monocoytse</li>
                </ul> 
              </div> 
              : null 
            } 

            {wbc ?
              <div>
                <ul>
                  <li>WBC</li>
                </ul> 
              </div> 
              : null 
            } 

            {neutropils ?
              <div>
                <ul>
                  <li>Neutropils</li>
                </ul> 
              </div> 
              : null 
            } 

            {lymphoytes ?
              <div>
                <ul>
                  <li>Lymphoytes</li>
                </ul> 
              </div> 
              : null 
            } 

            {ecsinophils ?
              <div>
                <ul>
                  <li>Ecsinophils</li>
                </ul> 
              </div> 
              : null 
            } 

            {basophils ?
              <div>
                <ul>
                  <li>Basophils</li>
                </ul> 
              </div> 
              : null 
            } 

            {others ?
              <div>
                <ul>
                  <li>Others</li>
                </ul> 
              </div> 
              : null 
            } 
        </>
        )
    }
}
