import React from 'react'
import { Card, CardBody, CardHeader, Table,Row,Col,Button } from 'reactstrap'
// import { Printer} from "react-feather";
function Sales() {
    return (
        <div>
          <Card>
              
              <CardHeader className="text-center font-weight-bold"><h4>Report summary (Dr Nasir Abdurahman)</h4></CardHeader>
              <CardBody>
                  <Row>   
                      <Col md={10}>
                       <Table striped style={{borderLeft:"3px solid blue",borderRight:"3px solid blue"}}>
                      <tbody>
                          <tr>
                          <td><h4>Total Drug Sales</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Total Drug Return</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Total Sales On credit</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Total Drug Purchase</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Other Expenses</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Cash at hand</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Petty cash</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                          <tr>
                          <td><h4>Total Bank</h4> </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td><td></td><td></td><td></td><td></td><td></td>
                          <td> <h4>₦0</h4></td>
                          </tr>
                      </tbody>
                  </Table>
                          </Col>    
                          <Col md={2}>
                              <Button color="primary" size="lg"> Print</Button>
                              </Col>          
                  </Row>

              </CardBody>
              </Card>  
        </div>
    )
}

export default Sales
