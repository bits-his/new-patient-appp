import React from 'react'
import { Card, CardHeader, Col, Row } from 'reactstrap'
// import { FallbackComp } from "../../../comp/components/FallbackSkeleton";

import Radiobox from '../../../comp/components/Radiobox'
import AutoComplete from '../../../comp/components/AutoComplete'

import SearchLab from '../../components/SearchLab'
import CheckItem from './checkbox-item'

function SelectLab({
  labList,
  labType,
  handleLabType,
  setExpandView,
  setExpandView2,
  specimenList,
  labInView,
  expandView,
  expandView2,
  handleAddBatchTest,
  handleTestAdd,
  labSearchTextRef,
  handleLabSelected,
  selectedLabs,
}) {
  return (
    <Card outline color="primary">
      <CardHeader className="d-flex justify-content-between ">
        {labList[0] &&
          labList[0].children &&
          labList[0].children.map((i, idx) => (
            <Radiobox
              key={idx}
              name="labType"
              label={i.description}
              checked={labType === i.title}
              value={i.title}
              onChange={() => {
                // console.log('main', i)
                handleLabType(i.title, i.children)
                setExpandView2({ header: '', tests: [] })
              }}
              // container='mb-0'
            />
          ))}
      </CardHeader>

      <div className="p-2" style={{ height: '65vh', overflow: 'auto' }}>
        {/* <CardBody className=""> */}
        {/* <ContinueReg reg={reg} /> */}
        {/* {JSON.stringify(labInView)} */}
        {labInView.length && labInView.length > 1 ? (
          <div className="m-0 pt-1 px-3 row" style={{ background: '#ddd' }}>
            {labInView
              .sort((a, b) => a.sort_index - b.sort_index)
              .map((test, i) => (
                <Radiobox
                  key={i}
                  container="col-md-4 font-weight-bold"
                  name="mainHead"
                  checked={expandView.header === test.title}
                  onChange={() => {
                    if (test.children.length) {
                      setExpandView({
                        header: test.title,
                        description: test.description,
                        tests: test.children,
                      })
                      // handleAddBatchTest(
                      //   test.children,
                      //   labType,
                      //   test.title,
                      //   test
                      // );
                      setExpandView2({ header: '', tests: [] })
                    } else {
                      // handleTestAdd(test, labType, "");
                      setExpandView({ header: '', tests: [] })
                      setExpandView2({ header: '', tests: [] })
                    }
                  }}
                  label={test.description}
                />
              ))}
          </div>
        ) : null}

        <div className="row m-0 mt-1">
          <SearchLab
            _ref={labSearchTextRef}
            inputClass="col-md-8 col-lg-8 px-0 pr-1"
            selectedUnit={labType}
            handleResult={handleLabSelected}
          />

          <AutoComplete
            // label="Sample"
            options={specimenList}
            labelKey="specimen"
            name="specimen"
            placeholder="Select Sample"
            // value={lab.specimen}
            onChange={(value) => {
              if (value.length) {
                // logChange('specimen', value[0].specimen);
              }
            }}
            // onInputChange={(value) => logChange('specimen', value)}
            containerClass="col-md-4 col-lg-4 px-0"
            // _ref={subRef}
          />
        </div>

        <Row className="m-0">
          {expandView.tests.length ? (
            <Col md={expandView2.tests.length ? 6 : 12} className=" m-0 px-4">
              {/* <h6 className="text-center">{expandView.description}</h6> */}
              <div className="row">
                {expandView.tests
                  .sort((a, b) => a.sort_index - b.sort_index)
                  .map((test, i) => (
                    <CheckItem
                      key={i}
                      containerClass={
                        expandView2.tests.length
                          ? 'col-md-12 mb-1'
                          : 'col-md-6 mb-1'
                      }
                      disabled={test.selectable === 'not allowed'}
                      checked={
                        test.children.length
                          ? selectedLabs.filter((j) => j.group === test.title)
                              .length === test.children.length
                          : selectedLabs.findIndex(
                              (i) => i.test === test.title,
                            ) !== -1
                      }
                      onChange={() => {
                        // console.log(test);
                        if (test.children.length) {
                          setExpandView2({
                            header: test.title,
                            description: test.description,
                            tests: test.children,
                          })

                          // scrollToRef(expandedViewRef);
                          handleAddBatchTest(
                            test.children,
                            labType,
                            test.title,
                            test,
                          )
                        } else {
                          handleTestAdd(test, labType, '')
                          setExpandView2({ header: '', tests: [] })
                        }
                      }}
                      label={test.description}
                    />
                  ))}
              </div>
            </Col>
          ) : null}
          {expandView2.tests.length ? (
            <Col
              md={6}
              className="border border-secondary rounded px-4 p-1 my-1"
            >
              <h6 className="text-center">{expandView2.description}</h6>

              {expandView2.tests
                .sort((a, b) => a.sort_index - b.sort_index)
                .map((test, i) => (
                  <>
                  {/* {JSON.stringify(test.selectable === 'not allowed')} */}
                  <CheckItem
                    key={i}
                    containerClass="col-md-12"
                    disabled={test.selectable === 'not allowed'}
                    checked={
                      selectedLabs.findIndex((i) => i.test === test.title) !==
                      -1
                    }
                    onChange={() =>
                      handleTestAdd(test, labType, expandView.header)
                    }
                    label={test.description}
                  />
                  </>
                ))}
            </Col>
          ) : null}
        </Row>
        {/* </CardBody> */}
      </div>
    </Card>
  )
}

export default SelectLab
