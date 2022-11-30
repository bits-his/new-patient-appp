import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button } from 'reactstrap'
import { CustomButton, SearchBar } from '../../../components/UI'
import CustomCard from '../../../components/UI/CustomCard'
// import { _deleteApi, _fetchApi } from "../../../redux/action/api";
import { useNavigate } from 'react-router-dom'
import { deletePharmUsers, getPharmUser } from '../../../redux/action/pharmacy'
import Loading from '../../../components/UI/Loading'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const pharmUsers = useSelector((state) => state.pharmacy.pharmUsers)
  const loading = useSelector((state) => state.pharmacy.loading)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const _getPharmUsers = useCallback(() => {
    dispatch(getPharmUser())
  }, [dispatch])

  useEffect(() => _getPharmUsers(), [_getPharmUsers])

  const handleSearchTermChange = (value) => {
    setSearchTerm(value)
  }

  const handleDelete = (userId) => {
    dispatch(deletePharmUsers(userId))
  }

  const rows = []
  if (pharmUsers) {
    pharmUsers.length &&
      pharmUsers.forEach((user, i) => {
        if (
          user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
        )
          return

        rows.push(
          <TableRow
            index={i + 1}
            user={user}
            fullname={user.fullname}
            username={user.username}
            phone={user.phone}
            role={user.role}
            id={user.id}
            handleDelete={handleDelete}
          />,
        )
      })
  }

  return (
    <CustomCard header="Manage your users">
      <CustomButton
        className="mb-2"
        onClick={() => navigate('/me/pharmacy/manage-user/form')}
      >
        Create New User
      </CustomButton>
      <SearchBar
        className="mb-2"
        filterText={searchTerm}
        onFilterTextChange={handleSearchTermChange}
        placeholder="Search users by name"
      />
      {loading && <Loading size="sm" />}
      <div style={{ maxHeight: '70vh' }}>
        <Table size="sm" bordered hover striped>
          <thead>
            <tr>
              <th>S/N</th>
              <th className="text-center">Name</th>
              <th className="text-center">Phone No.</th>
              <th className="text-center">Role</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </CustomCard>
  )
  // }
}

const TableRow = ({ username, role, handleDelete, id, index, phone }) => {
  // const history = useHistory()

  const handleClick = () => {
    // history.push(`/app/admin/staffreview/${id}`)
  }
  return (
    <>
      <tr>
        <td>{index}</td>
        <td>{username}</td>
        <td>{phone}</td>
        <td>{role}</td>
        <td className="text-center">
          {/* <Button
            color="success"
            size="sm"
            onClick={() => handleClick()}
            className="mr-1"
          > */}
          {/* <MdRateReview
              size={20}
              fontWeight="bold"
            /> */}
          {/* Edit
          </Button> */}
          <Button color="danger" size="sm" onClick={() => handleDelete(id)}>
            {/* <MdDelete size={20} fontWeight="bold" /> */}
            Delete
          </Button>
        </td>
      </tr>
    </>
  )
}
