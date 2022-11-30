import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Form, FormGroup, Card, CardHeader, CardBody } from 'reactstrap'
import { getAccHeads, createAccHead } from '../../redux/actions/transactions'
import { getAccChart } from '../../redux/actions/account'
import { queryAccountChart } from './helpers'
import Tree from '../comp/components/sortable-tree'

const AccountChart = () => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    head: '',
    subHead: '',
    description: '',
    accountCharFormAlert: '',
    deletable: false,
  })

  const headRef = React.useRef(null)

  const accHeads = useSelector((state) => state.transactions.accHeads)
  // const loadingAccHead = useSelector(
  //   (state) => state.transactions.loadingAccHead,
  // )
  // const accountChart = useSelector((state) => state.account.accountChart)
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const accChartTree = useSelector((state) => state.account.accChartTree)

  const _createAccHead = (data, callback) => {
    dispatch(createAccHead(data, callback))
  }

  // const getNextCode = (subhead) => {
  //   _fetchApi(
  //     `${apiURL()}/account/chart/next-code/${subhead}`,
  //     (data) => {
  //       setState((p) => ({ ...p, description: data.results }))
  //     },
  //     (err) => {
  //       console.log(err)
  //     },
  //   )
  // }

  const setHead = (head) => setState((p) => ({ ...p, head }))
  const setSubHead = (subHead) => setState((p) => ({ ...p, subHead }))
  const setDescription = (description) =>
    setState((p) => ({ ...p, description }))
  const setAlert = (accountCharFormAlert) =>
    setState((p) => ({ ...p, accountCharFormAlert }))

  const handleSubmit = (e) => {
    e.preventDefault()

    const { head, subHead, description } = state

    if (head === '') {
      setAlert('Please provide Account Head')
    } else {
      const data = { head, subHead, description }
      _createAccHead(data, resetForm)
    }
  }

  const handleDelete = () => {}

  useEffect(() => {
    dispatch(getAccHeads())
    dispatch(getAccChart())
  }, [dispatch])

  const resetForm = () => setState((p) => ({ ...p, head: '', description: '' }))

  const getNextCode = (code) => {
    queryAccountChart(
      { subHead: code, facilityId, query_type: 'next child' },
      (d) => setState((p) => ({ ...p, description: d[0].next_code })),
    )
  }

  const handleChartClick = (node) => {
    setState((p) => ({ ...p, subHead: node.title }))
    headRef.current.setState({
      text: `${node.description} (${node.title})`,
      deletable: !node.children.length,
    })
    // console.log(node.children.length);

    getNextCode(node.title)
  }

  return (
    <Card>
      <CardHeader>
        <h5>Chart of Account Setup</h5>
      </CardHeader>
      <CardBody>
        <div className="row">
          <Form className="col-md-4 col-lg-4">
            <FormGroup>
              <label>Select Account Head</label>
              <Typeahead
                id="head"
                align="justify"
                labelKey={(item) => `${item.description} (${item.head})`}
                options={accHeads}
                onChange={(val) => {
                  if (val.length) {
                    let selected = val[0]
                    setSubHead(selected['head'])
                    getNextCode(selected.description)
                    // console.log(selected);
                  }
                }}
                // onInputChange={head => setSubHead(head)}
                // allowNew
                ref={headRef}
              />
            </FormGroup>
            <FormGroup>
              <label>Account Subhead Code</label>
              <input
                type="text"
                className="form-control"
                name="description"
                onChange={({ target: { value } }) => setDescription(value)}
                value={state.description}
              />
            </FormGroup>
            <FormGroup>
              <label>Account Subhead Description</label>
              <input
                type="text"
                className="form-control"
                name="head"
                onChange={({ target: { value } }) => setHead(value)}
                value={state.head}
              />
            </FormGroup>

            <center>
              <span style={{ color: 'red' }}>
                {state.accountCharFormAlert.length
                  ? state.accountCharFormAlert
                  : null}
              </span>
            </center>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Create
            </button>
            {state.deletable && (
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            )}
            {/* {JSON.stringify(accChartTree)} */}
          </Form>
          <div className="col-md-8 col-lg-8">
            {/* {} */}
            {/* <ChartTree tree={accChartTree} /> */}
            <Tree
              treeInfo={accChartTree}
              // getNodeKey={({ node }) => node.id}
              generateNodeProps={({ node, path }) => ({
                title: `${node.title} - ${node.description}`,
                buttons: [
                  <button
                    className="btn btn-outline"
                    onClick={() => handleChartClick(node)}
                  >
                    Edit
                  </button>,
                  //   !node.children.length &&<button
                  //   className="btn btn-outline"
                  //   onClick={() => handleChartClick(node)}
                  // >
                  //   Edit
                  // </button>,
                ],
                // style: { backgroundColor:'red'}
              })}
              treeLoading={false}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default AccountChart
