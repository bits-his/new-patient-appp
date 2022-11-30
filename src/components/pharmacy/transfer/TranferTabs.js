import React from "react";
import { AiOutlineShop } from "react-icons/ai";
import { useQuery } from "../../../hooks";
// import HorizontalMenuItem from "../../comp/components/horizontal-menu/HorizontalMenuItem";
import ListMenuItem from "../../comp/components/vertical-menu/ListMenuItem";
import VerticalMenu from "../../comp/components/vertical-menu/VerticalMenu";

export const TransferTabs = ({ options = [], ref_from = {} }) => {
  const query = useQuery();
  const store = query.get("tab");
  const store_name = query.get("store");

  return (
    <React.Fragment>
      <VerticalMenu title="List of Stores">
        {options &&
          options.map((item) => (
            <div
              onClick={() =>{
                // ref_from.current &&
                // ref_from.current.setState({ text: item.store_name })
              }}
            >
              {/* {JSON.stringify(store_name)} 
            {JSON.stringify()} */}
              <ListMenuItem
                route={`/me/pharmacy/transfer?tab=${store}&store=${item.store_name}`}
                active={store_name === item.store_name ? true : false}
              >
                <div>
                  <AiOutlineShop size={26} style={{ marginRight: 5 }} />
                  <span className="font-weight-boldx">{item.store_name}</span>
                </div>
              </ListMenuItem>
            </div>
          ))}
      </VerticalMenu>
    </React.Fragment>
  );
};
