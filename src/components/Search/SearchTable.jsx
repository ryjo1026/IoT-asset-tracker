import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import SearchTableHeader from './SearchTableHeader.jsx';
import SearchTableToolbar from './SearchTableToolbar.jsx';

// Stateful component but should only handle UI state
export default class SearchTable extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    checkIsSelected: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      order: 'desc',
      orderBy: 'deviceName',
      page: 0,
      rowsPerPage: 10,
    };

    this.columnData = [
      {id: 'deviceName', numeric: false, disablePadding: false, label: 'Device Name'},
      {id: 'minPrice', numeric: true, disablePadding: false, label: 'Minimum Bid (ether)'},
      {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
    ];

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleRequestSort = this.handleRequestSort.bind(this);
  }

  handleChangeRowsPerPage(event) {
    this.setState({rowsPerPage: event.target.value});
  }

  handleChangePage(event, page) {
    this.setState({page});
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({order, orderBy});
    this.props.onRequestSort(order, orderBy);
  }

  render() {
    const {onRowClick, checkIsSelected, data} = this.props;
    const {page, rowsPerPage} = this.state;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div className='SearchTable' style={{overflowX: 'auto'}}>
        <SearchTableToolbar/>
        <Table>
          <SearchTableHeader
            columnData={this.columnData}
            order={this.state.order}
            orderBy={this.state.orderBy}
            onRequestSort={this.handleRequestSort}
            rowCount={data.length}/>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n) => {
                let statusStyle = n.status ? {color: 'green'} : {color: 'red'};
                let statusText = n.status ? 'Bidding open' : 'Bidding closed';
                return (
                  <TableRow
                    hover
                    onClick={(event) => onRowClick(event, n.id)}
                    tabIndex={-1}
                    key={n.id}
                    selected={checkIsSelected(n.id)}>
                      <TableCell component="th" scope="row">
                        {n.name}
                      </TableCell>
                      <TableCell numeric>
                        {n.minPrice}
                      </TableCell>
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
          count={data.length}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>);
  }
}
