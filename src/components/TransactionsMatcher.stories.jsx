import { useEffect, useState } from 'react';
import TransactionsMatcher from './TransactionsMatcher';
import axios from 'axios';

const meta = {
  component: TransactionsMatcher,
};

export default meta;

function APITransactionList() {
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    axios.get("http://localhost:3000/transactions").then(response => {
      setTransactions(response.data)
    })
  }, [])
  return <TransactionsMatcher transactions={transactions}></TransactionsMatcher>
}

export const Default = {
  render() {
    return <APITransactionList />
  }
};