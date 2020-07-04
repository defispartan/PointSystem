# Point System

This project tracks the total points earned customers with a breakdown of each month. Customers earn 2 points for every dollar spent over $100 and 1 point for every dollar spent over $50. The system displays information about customer points and transactions, and has forms to add transactions and customers. The system comes preloaded with 10 customers and 20 transactions. The initial transactions fall inside a three month, but you are not limited to add transactions within these three months. When adding a transaction oustide the three month window, the customer table will automatically re-render with new columns to represent the new timeframe.

Note: When adding transactions, sometimes the transaction may appear in the table as belonging to the previous month if the transaction is on the first of the month. This is because JavaScript's date library treats the entered date as belonging to your browsers timezone and converts it into GMT to store.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

To install the necessary dependencies to run the project.

### `yarn start`

or

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

or

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
