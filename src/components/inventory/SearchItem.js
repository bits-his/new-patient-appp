import React, { Fragment } from "react";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { apiURL } from "../../redux/actions";

function SearchItem(props) {
  let [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const facilityId = useSelector((state) => state.auth.user.facilityId);

  const handleSearch = (query) => {
    setIsLoading(true);
    setSearchTerm(query);
    fetch(`${apiURL()}/account/get/item_name/${facilityId}?item_name=${query}`)
      .then((resp) => resp.json())
      .then(({ itemInfo }) => {
        if (itemInfo.length === 1) {
          props.handleResult(searchTerm, itemInfo[0]);
          props._ref.current.setState({ text: itemInfo[0].item_name });
        } else {
          setOptions(itemInfo);
        }

        setIsLoading(false);
      });
  };

  return (
    <div className="form-group has-search">
      <span className="form-control-feedback">
        <FaSearch />
      </span>
      <AsyncTypeahead
        ref={props._ref}
        id="search-item_name"
        isLoading={isLoading}
        labelKey="item_name"
        minLength={3}
        onSearch={handleSearch}
        options={options}
        placeholder={props.placeholder || "Search Item by Name or Barcode"}
        emptyLabel=""
        renderMenuItemChildren={(option, props) => (
          <Fragment>
            <div className="font-weight-bold mr-1">
              {option.item_name} (₦ {option.unit_price})
            </div>
            <div>
              <span className="font-weight-bold mr-1">Expiry:</span>
              {option.expiring_date}
            </div>
          </Fragment>
        )}
        onChange={(val) => {
          if (val.length) {
            props.handleResult(searchTerm, val[0]);
          }
        }}
        {...props}
      />
    </div>
  );
}

export default SearchItem;
