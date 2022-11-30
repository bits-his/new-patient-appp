import React, { Fragment } from "react";
// import TextInput from '../../comp/components/TextInput';
import { FaSearch } from "react-icons/fa";
// import { _fetchApi } from '../../../redux/actions/api';
import { apiURL } from "../../../redux/actions";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

function SearchDispensaryDrug(props) {
  let [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const facilityId = useSelector((state) => state.auth.user.facilityId);

  const handleSearch = (query) => {
    setIsLoading(true);
    setSearchTerm(query);
    // let searchTerm = e.target.value;

    // fetch(`${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`)
    fetch(`${apiURL()}/drugs/sales/search/${facilityId}?drug=${query}`)
      .then((resp) => resp.json())
      .then(({ drugInfo }) => {
        // const options = items.map((i) => ({
        //   avatar_url: i.avatar_url,
        //   id: i.id,
        //   login: i.login,
        // }));
        // console.log(drugInfo)
        if (drugInfo.length === 1) {
          props.handleResult(searchTerm, drugInfo[0]);
          props.drugCodeRef.current.setState({ text: drugInfo[0].drug });
        } else {
          setOptions(drugInfo);
        }

        setIsLoading(false);
      });
  };

  //   const handleDrugChange = (e) => {
  //     let searchTerm = e.target.value;
  //     setDrug(searchTerm);
  //     fetch(`${apiURL()}/drugs/search/${facilityId}?drug=${searchTerm}`)
  //       .then((raw) => raw.json())
  //       .then((data) => {
  //         if (data.drugInfo) {
  //           props.handleResult(searchTerm, data.drugInfo[0]);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  return (
    <div className="form-group has-search">
      {/* {JSON.stringify(options)} */}
      <span className="form-control-feedback">
        <FaSearch />
      </span>
      <AsyncTypeahead
        ref={props.drugCodeRef}
        id="search-drug"
        isLoading={isLoading}
        labelKey="drug"
        minLength={3}
        onSearch={handleSearch}
        options={options}
        placeholder={props.placeholder || "Search Drug by Name or Barcode"}
        emptyLabel=""
        renderMenuItemChildren={(option, props) => (
          <Fragment>
            <div className="font-weight-bold mr-1">
              {option.drug} (₦ {option.price})
            </div>
            <div>
              <span className="font-weight-bold mr-1">Expiry:</span>
              {option.expiry_date}
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
      {/* <input
        name="searchDrug"
        ref={props._ref}
        onFocus={() => setDrug('')}
        value={drug}
        onChange={handleDrugChange}
        type="text"
        className="form-control"
        placeholder={props.placeholder || 'Search Drug by Name or Barcode'}
        {...props}
      /> */}
    </div>
  );
}

export default SearchDispensaryDrug;