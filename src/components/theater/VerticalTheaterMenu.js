import React from 'react';
import VerticalMenu from '../comp/components/vertical-menu/VerticalMenu';
import ListMenuItem from '../comp/components/vertical-menu/ListMenuItem';
import { FaTable, FaNotesMedical } from 'react-icons/fa';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { canUseThis } from '../auth';

function VerticalTheaterMenu() {
  const user = useSelector(state => state.auth.user)

  return (
    <VerticalMenu title="What would you like to do?">
      {/* <ListMenuItem route="/me/theater/operation-table">
        <FaTable size={26} style={{ marginRight: 10 }} /> 
        Operation Note Table
      </ListMenuItem> */}
       {/* {user.accessTo
        ? canUseThis(user, ['Operation Note Table']) && */}
      <ListMenuItem route="/me/theater/operation-table">
        <FaNotesMedical size={26} style={{ marginRight: 10 }} />
        Operation Note Table
      </ListMenuItem>
      {/* :null} */}
      {/* {user.accessTo
        ? canUseThis(user, ['Add New Doctor']) && */}
      <ListMenuItem route="/me/theater/process/add-new-doc">
        <AiOutlineUsergroupAdd size={26} style={{ marginRight: 10 }} /> 
        Add New Doctor
      </ListMenuItem>
      {/* :null} */}
    </VerticalMenu>
  );
}

export default VerticalTheaterMenu;
