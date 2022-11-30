import React, {Component} from 'react';
import {Table,Card, CardHeader,Input} from 'reactstrap'

class PendingLab extends Component{

    state={
        searchTerm:'',
        // loading:true
    }
    onSearchTermChange = e => {
        this.setState({ searchTerm: e.target.value });
      };
      render(){
        return(
            <div>
                <Card>
                {/* {loading && <Loading />} */}
                <CardHeader tag='h6'>Pending Lab Request</CardHeader>
                <Input
                style={{padding:10, margin:15}}
                  className="offset-md-1 col-md-11"
                  value={this.state.searchTerm}
                  onChange={this.onSearchTermChange}
                  placeholder="Search requests by ID"
                />
               <div style={{margin:15}}>
               <Table hover bordered striped responsive>
                <thead>
                    <tr>
                    <th>Patient Id</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Diagnosis/Clinical Note</th>
                    <th>Speciment Needed</th>
                    <th>Investigation Request</th>
                    <th>Date Request</th>
                    <th>Process Sample</th>
                    </tr>
                </thead>
                <tbody>
            
                </tbody>
                </Table>
               </div>
                </Card>
                
            </div>
        )
    }
    }


export default PendingLab;