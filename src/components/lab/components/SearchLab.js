import React, { Fragment } from "react";
// import TextInput from '../../comp/components/TextInput';
import { FaSearch } from "react-icons/fa";
import { apiURL } from "../../../redux/actions";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

function SearchLab(props) {
  let [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const facilityId = useSelector((state) => state.auth.user.facilityId);

  const handleSearch = (query) => {
    setIsLoading(true);
    setSearchTerm(query);

    // fetch(`${apiURL()}/lab/search/${facilityId}?lab=${query}`)
    fetch(
      `${apiURL()}/lab/search/${facilityId}?lab=${query}`
    )
      .then((resp) => resp.json())
      .then(({ labInfo }) => {
        // if (labInfo.length === 1) {
        //   props.handleResult(searchTerm, labInfo[0]);
        //   props._ref.current.setState({ text: labInfo[0].drug });
        // } else {
        setOptions(labInfo);
        // }

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
    <div className={`${props.inputClass} form-group has-search`}>
      {/* {JSON.stringify(options)} */}
      <span className="form-control-feedback">
        <FaSearch />
      </span>
      <AsyncTypeahead
        clearButton
        ref={props._ref}
        id="search-drug"
        isLoading={isLoading}
        labelKey="description"
        minLength={1}
        onSearch={handleSearch}
        options={options}
        placeholder={props.placeholder || "Search test by name"}
        emptyLabel=""
        renderMenuItemChildren={(option, props) => (
          <Fragment>
            <div className="font-weight-bold mr-1">
              {option.description}
              {option.price ? ` (₦ ${option.price})` : ""}
            </div>
            {/* {JSON.stringify(option)} */}
          </Fragment>
        )}
        onChange={(val) => {
          if (val.length) {
            console.log(val)
            props.handleResult(searchTerm, val[0]);
          }
        }}
        {...props}
      />
    </div>
  );
}

export default SearchLab;
