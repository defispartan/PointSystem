import React, { useState } from "react";
import "./App.css";
import Transactions from "./components/Transactions";
import Customers from "./components/Customers";

// Initialize some customers into the system
var initialCustomers = {
  0: "Bernard",
  1: "John",
  2: "Brenda",
  3: "Corey",
  4: "Jessica",
  5: "Antonio",
  6: "Faith",
  7: "Brendan",
  8: "Julie",
  9: "Torien",
  10: "Case",
};

// Initialize some transactions into the system
const initialTransactions = {
  0: { date: "2020-04-03", time: "04:00", amount: 101.0515, customerId: 2 },
  1: { date: "2020-04-05", time: "15:00", amount: 110.1243, customerId: 1 },
  2: { date: "2020-04-09", time: "10:25", amount: 4.1521, customerId: 7 },
  3: { date: "2020-04-15", time: "12:54", amount: 40.6391, customerId: 4 },
  4: { date: "2020-04-18", time: "01:23", amount: 1000.0139, customerId: 3 },
  5: { date: "2020-04-22", time: "04:12", amount: 120.01, customerId: 5 },
  6: { date: "2020-04-25", time: "11:09", amount: 55.0, customerId: 5 },
  7: { date: "2020-04-29", time: "21:47", amount: 115.7, customerId: 2 },
  8: { date: "2020-05-02", time: "12:24", amount: 240.87, customerId: 0 },
  9: { date: "2020-05-11", time: "05:01", amount: 120.01, customerId: 1 },
  10: { date: "2020-05-12", time: "03:53", amount: 24.43, customerId: 9 },
  11: { date: "2020-05-15", time: "07:36", amount: 180.43, customerId: 4 },
  12: { date: "2020-05-25", time: "15:19", amount: 77.65, customerId: 1 },
  13: { date: "2020-05-29", time: "02:44", amount: 31.25, customerId: 0 },
  14: { date: "2020-06-02", time: "01:58", amount: 330.3354, customerId: 5 },
  15: { date: "2020-06-05", time: "18:00", amount: 551.1, customerId: 9 },
  16: { date: "2020-06-06", time: "12:17", amount: 199.97, customerId: 7 },
  17: { date: "2020-06-13", time: "04:31", amount: 23.0991, customerId: 1 },
  18: { date: "2020-06-17", time: "06:41", amount: 57.7, customerId: 8 },
  19: { date: "2020-06-25", time: "17:22", amount: 67.942, customerId: 1 },
  20: { date: "2020-06-29", time: "03:58", amount: 431.764, customerId: 7 },
};

function App() {
  // State to store the customers in the system
  const [customers, addCustomer] = useState(initialCustomers);
  // State to store transactions in the system
  const [transactions, addTransaction] = useState(initialTransactions);

  // Adds a new customer into the system
  // Triggered by Customers component
  const addCustomerForm = (name) => {
    const newIndex = Object.keys(customers).length;
    addCustomer({ ...customers, [newIndex]: name });
  };

  // Adds a new transaction into the system
  // Truggered by Transactions component
  const addTransactionForm = (transaction) => {
    const newIndex = Object.keys(transactions).length;
    addTransaction({ ...transactions, [newIndex]: transaction });
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Point System</h1>
        <p>
          Customers receive 2 points for every dollar spend over $100 in each
          transaction, plus 1 point for every dollar spent over $50 in each
          transaction.
        </p>
      </div>
      <Transactions
        customers={customers}
        transactions={transactions}
        addTransaction={(transaction) => addTransactionForm(transaction)}
      />
      <Customers
        customers={customers}
        transactions={transactions}
        addCustomer={(name) => addCustomerForm(name)}
      />
    </div>
  );
}

export default App;
