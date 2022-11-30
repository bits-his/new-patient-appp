import React, { useEffect } from "react";
import {
  Col,
  Row,
  Form,
  Label,
  Input,
  Card,
  CardBody,
  CardHeader,
  Table,
} from "reactstrap";
import { _deleteApi, _fetchApi, _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useState } from "react";
import CustomButton from "../comp/components/Button";
import { _customNotify, _warningNotify } from "../utils/helpers";

export default function AntibioticsForm() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [antibiotic, setAntibiotic] = useState("");

  const getAntibiotics = () => {
    _fetchApi(
      `${apiURL()}/lab/sensitivities`,
      (data) => {
        if (data.success) {
          setList(data.results);
        }
      },
      (err) => console.log(err)
    );
  };

  const saveNewAntibiotic = (e) => {
    e.preventDefault();
    setLoading(true);
    _postApi(
      `${apiURL()}/lab/sensitivities/new`,
      { antibiotic },
      () => {
        _customNotify("New Antibiotic Saved!");
        setLoading(false);
        setAntibiotic("");
        getAntibiotics();
      },
      () => setLoading(false)
    );
  };

  const deleteAntibiotic = (antibiotic) => {
    _deleteApi(
      `${apiURL()}/lab/sensitivities`,
      { antibiotic },
      (data) => {
        console.log(data);
        _customNotify("Successfully deleted sensitivity");
        getAntibiotics();
      },
      (err) => {
        console.log(err);
        _warningNotify("Unable to delete sensitivity, try again later.");
      }
    );
  };

  useEffect(() => {
    getAntibiotics();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>ANTIBIOTICS</CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col md={6}>
                <Form onSubmit={saveNewAntibiotic}>
                  <Label for="antibiotic" className="font-weight-bold">
                    New Antibiotic
                  </Label>
                  <Input
                    type="text"
                    id="antibiotic"
                    name="antibiotic"
                    onChange={(e) => setAntibiotic(e.target.value)}
                    placeholder="Enter new antibiotic here"
                  />
                  <center>
                    <CustomButton
                      loading={loading}
                      disabled={antibiotic === ""}
                      type="submit"
                      className="pl-4 pr-4 mr-3 mt-3"
                    >
                      Save
                    </CustomButton>
                  </center>
                </Form>
              </Col>
              <Col md={6}>
                {/* <CardTitle className="text-center" tag="h6">
                  Sensitivities
                </CardTitle> */}
                <Table size="sm" bordered>
                  <thead>
                    <tr>
                      <th>Antibiotics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item, i) => (
                      <tr key={i}>
                        <td className="d-flex flex-direction-row justify-content-between">
                          {item.antibiotic}{" "}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteAntibiotic(item.antibiotic);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
