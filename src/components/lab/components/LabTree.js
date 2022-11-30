import React, { useState } from 'react'
import ConfirmAction from '../../comp/alert/ConfirmAction'
import Tree from '../../comp/components/sortable-tree'
import { _customNotify } from '../../utils/helpers'
import { postLabSetup } from '../lab-setup/helper'
// import { useDispatch, useSelector } from 'react-redux';
// // import { getLabTree } from '../actions/labActions';
// import { getLabTreeFromDB } from '../labRedux/actions';

export default function LabTree({
  handleEditTree = (f) => f,
  labServices,
  handleAddNode = (f) => f,
  handleDeleteNode = (f) => f,
  showAdd = true,
  showEdit = true,
  showDelete = false,
  refreshList = (f) => f,
}) {
  const [selected, setSelected] = useState({})
  const [warningIsOpen, setWarningIsOpen] = useState(false)
  const toggleWarning = () => setWarningIsOpen((p) => !p)
  // const dispatch = useDispatch();
  // const labTree = useSelector((state) => state.lab.labTree);
  // const loadingLabTree = useSelector((state) => state.lab.loadingLabTree);

  // const _getLabTree = () => {
  //   dispatch(getLabTreeFromDB());
  // };

  // useEffect(() => _getLabTree(), []);
  const handleNodeDelete = () => {
    postLabSetup({ query_type: 'delete', subhead: selected.title }, () => {
      _customNotify('Item Deleted Successfully')
      refreshList()
    })
  }

  return (
    <>
      {/* {JSON.stringify(labTree)} */}
      <Tree
        height="80vh"
        treeInfo={labServices}
        treeLoading={false}
        generateNodeProps={({ node, path }) => ({
          title: `${node.title} - ${node.description}`,
          buttons: [
            showAdd && (
              <button
                className="btn btn-success btn-sm mr-1"
                onClick={() => handleAddNode(node)}
              >
                Add
              </button>
            ),
            showEdit && (
              <button
                className="btn btn-primary btn-sm mr-1"
                onClick={() => handleEditTree(node)}
              >
                Edit
              </button>
            ),
            node.children.length ? null : (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setSelected(node)
                  toggleWarning()
                }}
              >
                Delete
                {/* {JSON.stringify(node)} */}
              </button>
            ),
          ],
        })}
      />
      <ConfirmAction
        modal={warningIsOpen}
        setModal={toggleWarning}
        confirmBtnAction={handleNodeDelete}
      />
    </>
  )
}
