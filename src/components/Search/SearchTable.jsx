import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import SearchTableHeader from './SearchTableHeader.jsx';
import SearchTableToolbar from './SearchTableToolbar.jsx';

// Stateless handler for table functions
class SearchTable extends React.Component {
  constructor(props, context) {
    super(props);

    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  renderStatus(status) {
    if (status) {
      return (<TableCell >
        <div style={{color: 'green'}}>Availible</div>
      </TableCell>);
    }
    return (<TableCell >
      <div style={{color: 'red'}}>In Use</div>
    </TableCell>);
  }

  handleRequestSort(event, property) {
    this.props.onRequestSort(event, property);
  }

  handleChangePage(event, page) {
    this.props.onChangePage(event, page);
  }

  handleChangeRowsPerPage(event) {
    this.props.onChangeRowsPerPage(event);
  }

  handleClick(event, id) {
    return this.props.onRowClick(event, id);
  }

  isSelected(id) {
    return this.props.isSelected(id);
  }

  render() {
    const emptyRows = this.props.rowsPerPage -
      Math.min(this.props.rowsPerPage,
      this.props.data.length - this.props.page * this.props.rowsPerPage);

    return (
      <div className='SearchTable' style={{overflowX: 'auto'}}>
        <SearchTableToolbar/>
        <Table>
          <SearchTableHeader
            columnData={this.props.columnData}
            order={this.props.order}
            orderBy={this.props.orderBy}
            onRequestSort={this.handleRequestSort}
            rowCount={this.props.data.length}/>
          <TableBody>
            {this.props.data.slice(this.props.page * this.props.rowsPerPage,
              this.props.page * this.props.rowsPerPage + this.props.rowsPerPage)
              .map((n) => {
                return (
                  <TableRow
                      hover
                      onClick={(event) => this.handleClick(event, n.id)}
                      tabIndex={-1}
                      key={n.id}
                      selected={this.isSelected(n.id)}>
                      <TableCell component="th" scope="row">
                        {n.deviceName}
                      </TableCell>
                      <TableCell numeric>{n.minPrice}</TableCell>
                      {this.renderStatus(n.status)}
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
          count={this.props.data.length}
          rowsPerPage={this.props.rowsPerPage}
          page={this.props.page}
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

export default SearchTable;
