import React, { useState, useEffect } from "react";
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

// Calculate number of points earned given a transaction amount
function pointsEarned(amount) {
  amount = Math.floor(amount);
  var points = 0;
  while (amount > 100) {
    points = points + 2;
    amount = amount - 1;
  }
  while (amount > 50) {
    points = points + 1;
    amount = amount - 1;
  }
  return points;
}

export default function Customers(props) {
  // State to decide whether to show error message for adding a customer without a name
  const [addCustomerError, setAddCustomerError] = useState(false);
  // State to store object with points by month for each customer
  const [customerPointsByMonth, editMonth] = useState(props.customers);
  // State to store object with cumulative points for each customer
  const [customerTotalPoints, editTotal] = useState(props.customers);
  // State to store the start month for transaction dates
  const [startMonth, setStartMonth] = useState(null);
  // State to store the end month for transaction dates
  const [endMonth, setEndMonth] = useState(null);
  // State to store whether the table has been initialized with points yet
  // Used to determine whether or not to update or initialize when props.transactions is changed
  const [pointsInitialized, setPointsInitialized] = useState(false);

  // Find the start and end months from the initial transactions list
  // Creates an array of transaction dates, sorts it, then sets the first and last months accordingly
  const monthArray = [];
  useEffect(() => {
    // Disable unused variable warning
    // eslint-disable-next-line
    for (const [id, transaction] of Object.entries(props.transactions)) {
      monthArray.push(new Date(transaction.date));
    }
    monthArray.sort((a, b) => a.getTime() - b.getTime());
    setStartMonth(monthArray[0]);
    setEndMonth(monthArray[monthArray.length - 1]);
    // Disable dependency warning: transactions already initialized in App.js
    // eslint-disable-next-line
  }, []);

  // Effect triggered upon changing the start and end months
  // Once called with both endpoints set, creates and populates objects with monthly totals and cumulative points for each customer
  // Only called on initialization and when a transaction is added with a month outside the table bounds
  useEffect(() => {
    if (startMonth !== null && endMonth !== null) {
      // Initialize both point storage objects
      // Note: getMonth is indexed from 0 so we have to add 1
      var monthIncrement = startMonth.getMonth() + 1;
      var yearIncrement = startMonth.getFullYear();
      const monthStorage = {};
      const pointsByMonth = {};
      const pointsCumulative = {};
      for (const key of Object.keys(props.customers)) {
        pointsCumulative[key] = 0;
        pointsByMonth[key] = {};
      }
      // Add Month/Year indeces to the customer object until we reach the end month and year
      // Go one month further to ensure that the last month gets added too
      while (
        monthIncrement !== endMonth.getMonth() + 2 ||
        yearIncrement !== endMonth.getFullYear()
      ) {
        const dateString = monthIncrement + "/" + yearIncrement;
        for (const key of Object.keys(props.customers)) {
          pointsByMonth[key][dateString] = 0;
        }
        monthStorage[dateString] = 0;
        monthIncrement = monthIncrement + 1;
        if (monthIncrement === 13) {
          monthIncrement = 1;
          yearIncrement = yearIncrement + 1;
        }
      }

      // Loop through transactions and populate objects with point totals
      // eslint-disable-next-line
      for (const [id, transaction] of Object.entries(props.transactions)) {
        const customerId = transaction.customerId;
        const date = new Date(transaction.date);
        const dateString = date.getMonth() + 1 + "/" + date.getFullYear();
        const points = pointsEarned(transaction.amount);
        pointsCumulative[customerId] = pointsCumulative[customerId] + points;
        pointsByMonth[customerId][dateString] =
          pointsByMonth[customerId][dateString] + points;
      }
      // Update component state
      editMonth(pointsByMonth);
      editTotal(pointsCumulative);
      setPointsInitialized(true);
    }
    // eslint-disable-next-line
  }, [startMonth, endMonth]);

  // Effect triggered when new transaction is added and initialization has already taken place
  // If transaction date is inside the current table bounds, only update the relavent customers point info
  // If the transaction date falls outside the current table bounds, update bounds and recreate table
  useEffect(() => {
    if (pointsInitialized) {
      const newTransaction =
        props.transactions[Object.keys(props.transactions).length - 1];

      const newTransactionDate = new Date(newTransaction.date);
      if (newTransactionDate < startMonth) {
        setStartMonth(newTransactionDate);
      } else if (newTransactionDate > endMonth) {
        setEndMonth(newTransactionDate);
      } else {
        const newPoints = pointsEarned(newTransaction.amount);
        const dateString =
          newTransactionDate.getMonth() +
          1 +
          "/" +
          newTransactionDate.getFullYear();
        const updatedMonthPoints =
          customerPointsByMonth[newTransaction.customerId][dateString] +
          newPoints;

        var updatedMonth = { ...customerPointsByMonth };
        updatedMonth[newTransaction.customerId][
          dateString
        ] = updatedMonthPoints;
        editMonth(updatedMonth);
        editTotal({
          ...customerTotalPoints,
          [newTransaction.customerId]:
            customerTotalPoints[newTransaction.customerId] + newPoints,
        });
      }
    }
    // Disable dependency warning: point and month objects declared inside of initialization effect
    // eslint-disable-next-line
  }, [props.transactions]);

  // Handler for submitting form to add customer
  // Checks that name is no blank and adds customer to system
  function customerFormSubmit(event) {
    event.preventDefault();
    if (event.target.name.value === "") {
      setAddCustomerError(true);
    } else {
      setAddCustomerError(false);
      // Initialize point objects to zeros for this new customer
      const emptyMonth = {};
      // Disable unused variable warning
      // eslint-disable-next-line
      for (const [dateString, value] of Object.entries(
        customerPointsByMonth[0]
      )) {
        emptyMonth[dateString] = 0;
      }
      editMonth({
        ...customerPointsByMonth,
        [Object.keys(props.customers).length]: emptyMonth,
      });
      editTotal({
        ...customerTotalPoints,
        [Object.keys(props.customers).length]: 0,
      });
      props.addCustomer(event.target.name.value);
    }
  }

  // Renders table with customer point totals and form to add new customer
  return (
    <>
      <h2>Customers</h2>
      <Table bordered className="customersTable">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            {Object.keys(customerPointsByMonth[0]).map(
              (dateString, pointIndex) => {
                return <th key={pointIndex}>{"Points " + dateString}</th>;
              }
            )}
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.customers).map((customer, index) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>{props.customers[index]}</td>
                {Object.keys(customerPointsByMonth[index]).map(
                  (dateString, pointIndex) => {
                    return (
                      <td key={pointIndex}>
                        {customerPointsByMonth[index][dateString]}
                      </td>
                    );
                  }
                )}
                <td>{customerTotalPoints[index]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="addCustomer">
        <h2>Add Customer</h2>
        <Form
          className="customerForm"
          onSubmit={(event) => customerFormSubmit(event)}
        >
          <Row form>
            <Col sm={{ size: 2, offset: 5 }}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input type="string" name="name" id="name" />
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
          {addCustomerError ? (
            <Row>
              <div className="addCustomerError">
                <p>Please fill in the name field before adding a customer.</p>
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
