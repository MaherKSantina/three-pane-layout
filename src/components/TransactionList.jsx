import * as React from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import { FixedSizeList } from 'react-window';
import DataTableView from './DataTable';

const ExpandedComponent = ({ data }) => <pre>{data.description}</pre>;


export default function TransactionList({ transactions }) {

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
      <DataTableView columns={[
          {
            name: 'Description',
            selector: row => row.description,
            grow: 5,
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
        data={transactions}
        expandableRows 
        expandableRowsComponent={ExpandedComponent}
        >

      </DataTableView>
    </Box>
  );
}
