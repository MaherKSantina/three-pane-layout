import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import { FixedSizeList } from 'react-window';
import DataTableView from './DataTable';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

const ExpandedComponent = ({ data }) => <pre>{data.description}</pre>;


export default function TransactionList({ transactions, onRefresh }) {
const [search, setSearch] = useState('');
const [filteredData, setFilteredData] = useState([])

useEffect(() => {
  if(Array.isArray(transactions)) {} else {
    return
  }
  setFilteredData(transactions.filter(item =>
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.date.includes(search.toLowerCase()) ||
    item.group.includes(search.toLowerCase()) ||
    item.amount.includes(search.toLowerCase())
  ))
},[transactions, search])

  return (
    <Box
      sx={{
        width: "100%",
        height: "95%",
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        mx: 'auto',
        mt: 4,
        minHeight: 0,
      }}
    >
      <Button onClick={() => onRefresh?.()}>Refresh</Button>
      <input
        type="text"
        placeholder="Search…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12, padding: 8, width: 300 }}
      />
      <DataTableView columns={[
          {
            name: 'ID',
            selector: row => row.id,
          },
          {
            name: 'Description',
            selector: row => row.description,
            grow: 5,
          },
          {
            name: 'Group',
            selector: row => row.group,
            sortable: true,
          },
          {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
          },
          {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            sortFunction: (rowA, rowB) => {
              const amountA = Number(rowA.amount)
              const amountB = Number(rowB.amount)
              if (amountA > amountB) {
                return 1;
              }

              if (amountB > amountA) {
                return -1;
              }

              return 0;
            }
          },
        ]} 
        data={filteredData}
        expandableRows 
        expandableRowsComponent={ExpandedComponent}
        >

      </DataTableView>
    </Box>
  );
}
