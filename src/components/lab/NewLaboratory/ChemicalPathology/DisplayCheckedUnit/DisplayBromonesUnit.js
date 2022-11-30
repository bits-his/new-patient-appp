import React, {Component} from 'react'

export default class DisplayBromonesUnit extends Component{
render(){
    const {t3, t4, tsh, oestrogen, progesterone, prolactin, fsh, lh, testosterone } = this.props
    return(
        <>
            {t3 ?
                <div>
                  <ul>
                  <li>T3</li>
                </ul> 
              </div> 
              : null
              }

            {t4 ? 
              <div>
                <ul>
                  <li>T4</li>
                </ul> 
              </div> 
              : null
            }

            {tsh ?       
              <div>
                <ul>
                  <li>TSH</li>
                </ul> 
              </div> 
              : null
            }

            {oestrogen ?
              <div>
                <ul>
                  <li>Oestrogen</li>
                </ul> 
              </div> 
              : null 
            } 

            {progesterone ?
              <div>
                <ul>
                  <li>Progesterone</li>
                </ul> 
              </div> 
              : null 
            } 

            {prolactin ?
              <div>
                <ul>
                  <li>Prolactin</li>
                </ul> 
              </div> 
              : null 
            } 

            {fsh ?
              <div>
                <ul>
                  <li>FSH</li>
                </ul> 
              </div> 
              : null 
            } 

            {lh ?
              <div>
                <ul>
                  <li>LH</li>
                </ul> 
              </div> 
              : null 
            } 

            {testosterone ?
              <div>
                <ul>
                  <li>Testosterone</li>
                </ul> 
              </div> 
              : null 
            } 
        </>
        )
    }
}
