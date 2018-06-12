import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import SearchTableHeader from './SearchTableHeader.jsx';
import SearchTableToolbar from './SearchTableToolbar.jsx';

// Stateless handler for table functions
export default function SearchTable(props) {
  const emptyRows = props.rowsPerPage -
    Math.min(props.rowsPerPage,
    props.data.length - props.page * props.rowsPerPage);

  const {
    onChangePage,
    onChangeRowsPerPage,
    onRowClick,
    checkIsSelected,
  } = props;

  return (
    <div className='SearchTable' style={{overflowX: 'auto'}}>
      <SearchTableToolbar/>
      <Table>
        <SearchTableHeader
          columnData={props.columnData}
          order={props.order}
          orderBy={props.orderBy}
          onRequestSort={props.onRequestSort}
          rowCount={props.data.length}/>
        <TableBody>
          {props.data.slice(props.page * props.rowsPerPage,
            props.page * props.rowsPerPage + props.rowsPerPage)
            .map((n) => {
              let statusStyle = n.status ? {color: 'green'} : {color: 'red'};
              let statusText = n.status ? 'Availible' : 'In Use';
              return (
                <TableRow
                    hover
                    onClick={(event) => onRowClick(event, n.id)}
                    tabIndex={-1}
                    key={n.id}
                    selected={checkIsSelected(n.id)}>
                    <TableCell component="th" scope="row">
                      {n.deviceName}
                    </TableCell>
                    <TableCell numeric>{n.minPrice}</TableCell>
                    <TableCell >
                      <div style={statusStyle}>{statusText}</div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{height: 49 * emptyRows}}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={props.data.length}
        rowsPerPage={props.rowsPerPage}
        page={props.page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </div>);
}
// TODO cleanup
SearchTable.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  checkIsSelected: PropTypes.func.isRequired,
  columnData: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};
