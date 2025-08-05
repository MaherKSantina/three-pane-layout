import { useEffect, useState } from 'react';
import TransactionList from './TransactionList';
import axios from 'axios';
import SplitPane from './SplitPane3';

const meta = {
  component: TransactionList,
};

export default meta;

function APITransactionList() {
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    axios.get("https://api-digitalsymphony.ngrok.pizza/transactions").then(response => {
      setTransactions(response.data)
    })
  }, [])
  return <TransactionList transactions={transactions}></TransactionList>
}

export const Default = {
  render() {
    return <APITransactionList></APITransactionList>
  }
};

export const SplitPaneExample = {
  render() {
    return <SplitPane left={<APITransactionList></APITransactionList>} right={<APITransactionList></APITransactionList>} />
  }
};