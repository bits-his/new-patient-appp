import React, { useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Input } from 'reactstrap'
import CustomButton from '../../comp/components/Button'
import { _deleteApi, _updateApi } from '../../../redux/actions/api'
import { apiURL } from '../../../redux/actions'
import { _customNotify } from '../../utils/helpers'
// import Editor from "../../comp/components/Editor";
import { useHistory } from 'react-router'

function LabComments({
  editable = true,
  comments = [],
  getComment = (f) => f,
}) {
  const user = useSelector((state) => state.auth.user)

  if (!comments.length) return <p>No Comment</p>
  return (
    <div className="my-4">
      <label className="font-weight-bold">
        {comments[0].department === '5000'
          ? 'Radiologist Report'
          : 'Pathologist Report'}
      </label>

      {/* {JSON.stringify(comments[0])} */}
      <ul class="list-group">
        {comments.map((item, index) => (
          <CommentItem
            key={index}
            user={user}
            item={item}
            getComment={getComment}
            editable={editable}
          />
        ))}
      </ul>
    </div>
  )
}

function CommentItem({
  user = {},
  item = {},
  getComment = (f) => f,
  editable = true,
}) {
  const [edit, setEdit] = useState(false)
  const [comment, setComment] = useState(item.comment)

  const handleInputChange = (e) => setComment(e.target.value)
  const history = useHistory()
  const deleteComment = () => {
    const { id, labno } = item
    _deleteApi(
      `${apiURL()}/lab/doctor-comment`,
      { comment, id },
      () => {
        // console.log("success");
        _customNotify('Comment Deleted!')
        getComment(labno)
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const updateComment = () => {
    const { labno, id } = item
    _updateApi(
      `${apiURL()}/lab/doctor-comment`,
      { comment, labno, id },
      () => {
        // console.log("success");
        _customNotify('Comment Updated!')
        getComment(labno)
        setEdit(false)
        history.goBack('/me/lab/radiology-analysis')
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const createdBySelf = item.username === user.username

  return (
    <li class="list-group-item">
      {createdBySelf && editable ? (
        <span className="d-flex flex-row align-items-start justify-content-end mb-2">
          <button
            className="btn btn-sm btn-warning mr-1"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
          {/* <button className="btn btn-sm btn-danger" onClick={deleteComment}>
            Delete
          </button> */}
        </span>
      ) : null}
      {/* {JSON.stringify(item)} */}
      {edit ? (
        <div>
          {item.useTemplate ? (
            <textarea
              className="form-control"
              value={item.comment}
              onChange={({ target: { value } }) => setComment(value)}
            />
          ) : (
            // <Editor data={item.comment} onChange={(e) => setComment(e)} />
            <Input
              type="textarea"
              height="300px"
              value={comment}
              onChange={handleInputChange}
            />
          )}
          {edit === true ? (
            <>
              {' '}
              <center>
                <CustomButton
                  // size="sm"
                  className="mt-1"
                  color="warning"
                  onClick={updateComment}
                >
                  Update
                </CustomButton>
                {/* <CustomButton
                size="sm"
                className="mt-1 ml-1"
                color="dark"
                onClick={() => setEdit(false)}
              >
                Cancel
              </CustomButton> */}
              </center>
            </>
          ) : null}
          {/* {comment === item.comment ? (
            <center>
              <CustomButton
                size="sm"
                className="mt-1"
                color="success"
                onClick={updateComment}
              >
                Update
              </CustomButton>
              <CustomButton
                size="sm"
                className="mt-1 ml-1"
                color="dark"
                onClick={() => setEdit(false)}
              >
                Cancel
              </CustomButton>
            </center>
          ) : null} */}
        </div>
      ) : item.useTemplate === 'yes' ? (
        <div dangerouslySetInnerHTML={{ __html: item.comment }} />
      ) : (
        <p>{item.comment}</p>
      )}
      <div className="text-right text-small small">
        {createdBySelf ? 'self' : item.user} -{' '}
        {moment(item.created_at).fromNow()}
      </div>
    </li>
  )
}

export default LabComments
