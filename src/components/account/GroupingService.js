import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Table,
  Button,
  Form,
} from "reactstrap";
import CustomButton from "../comp/components/Button";

export default function GroupingService({
  modal = false,
  toggle = (f) => f,
  data = [],
  form = {},
  listData = [],
  handleAdd = (f) => f,
  handleChange = (f) => f,
  setForm = (f) => f,
  handleDelete = (f) => f,
  handleSubmitGroup = (f) => f,
  loading,
}) {
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Grouping Service</ModalHeader>
        <ModalBody>
          {/* {JSON.stringify(form)} */}

          <Form onSubmit={handleAdd}>
            <Col md={6}>
              <FormGroup>
                <div>
                  <Label>Group Name</Label>
                  <Input
                    name="description"
                    type="text"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>
            <Row className="m-2">
              <Col md={6}>
                <FormGroup>
                  <div>
                    <Label for="exampleSelect">Select Service</Label>
                    <Input
                      id="exampleSelect"
                      name="service_name"
                      type="select"
                      onChange={(e) => {
                        // console.log(e.target.value, "LLLLLLL");
                        const _data = data.filter(
                          (i) => i.title === e.target.value
                        )[0];
                        setForm((p) => ({
                          ...p,
                          subhead: _data.subhead,
                          head: _data.title,
                          service_name: _data.description,
                          price: _data.price,
                        }));
                      }}
                    >
                      <option>...Select ...</option>
                      {data.map((item, key) => (
                        <option key={key} value={item.title}>
                          {item.description}
                        </option>
                      ))}
                    </Input>
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      name="quantity"
                      type="text"
                      value={form.quantity}
                      onChange={handleChange}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <div className="text-center">
            <CustomButton type="submit" onClick={handleAdd}>
              Click to Add
            </CustomButton>
          </div>
        </ModalBody>
        <Table bordered hover responsive striped className="m-2">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Service Name</th>
              <th>Group Name</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listData &&
              listData.map((item, key) => (
                <tr>
                  <th scope="row">{key + 1}</th>
                  <td>{item.service_name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <Button
                      outline
                      size="sm"
                      color="danger"
                      onClick={() => handleDelete(key)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <ModalFooter>
          <CustomButton
            className="px-4"
            color="primary"
            loading={loading}
            onClick={() => {
              handleSubmitGroup();
            }}
          >
            Save
          </CustomButton>{" "}
          <CustomButton color="danger" onClick={toggle}>
            Cancel
          </CustomButton>
        </ModalFooter>
      </Modal>
    </div>
  );
}
