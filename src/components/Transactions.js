import React, { useState } from "react";
import {
  Table,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";

// Helper function to round amounts to 2 decimal places
function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

export default function Transactions(props) {
  // State to determine whether to display error for attempting to add transaction with missing fields
  const [addTransactionError, setAddTransactionError] = useState(false);

  // Handler for sumbitting transaction form
  // Verifies that all fields are entered and adds transaction to system
  function transactionFormSubmit(event) {
    event.preventDefault();
    if (
      event.target.date.value === "" ||
      event.target.time.value === "" ||
      event.target.amount.value.toString() === ""
    ) {
      setAddTransactionError(true);
    } else {
      setAddTransactionError(false);
      const newTransaction = {
        date: event.target.date.value,
        time: event.target.time.value,
        amount: event.target.amount.value,
        customerId: event.target.customerId.selectedIndex,
      };
      props.addTransaction(newTransaction);
    }
  }

  // Renders transactions table and form to add new transactions
  return (
    <>
      <h2>Transactions</h2>
      <Table bordered className="transactionsTable">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Customer ID</th>
            <th>Customer Name</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.transactions).map((transaction, index) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>{props.transactions[index].date}</td>
                <td>{props.transactions[index].time}</td>
                <td>{round(props.transactions[index].amount, 2)}</td>
                <td>{props.transactions[index].customerId}</td>
                <td>{props.customers[props.transactions[index].customerId]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="addTransaction">
        <h2>Add Transaction</h2>
        <Form
          className="transactionForm"
          onSubmit={(event) => transactionFormSubmit(event)}
        >
          <Row form>
            <Col md={3}>
              <FormGroup>
                <Label for="customerId">Customer ID</Label>
                <Input type="select" name="customerId" id="customerId">
                  {Object.keys(props.customers).map((name, index) => {
                    return (
                      <option key={index}>
                        {index + ": " + props.customers[index]}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input type="date" name="date" id="date" />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="time">Time</Label>
                <Input type="time" name="time" id="time" />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="amount">Amount</Label>
                <Input
                  type="decimal"
                  name="amount"
                  id="amount"
                  placeholder="0.00"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="submit"></Label>
                <Button>Add</Button>
              </FormGroup>
            </Col>
          </Row>
          {addTransactionError ? (
            <Row>
              <div className="addTransactionError">
                <p>Please fill in all fields before adding transaction.</p>
              </div>
            </Row>
          ) : (
            <></>
          )}
        </Form>
      </div>
    </>
  );
}
