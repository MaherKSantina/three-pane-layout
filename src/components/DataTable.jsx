import DataTable from 'react-data-table-component';

export default function DataTableView(props) {
	return (
		<DataTable
			{...props}
            selectableRows
            pagination
		/>
	);
};