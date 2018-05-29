import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class SearchTable extends React.Component {
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

  render() {
    return (
      <div className='SearchTable'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell numeric>Minimum Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.data.map((n) => {
              return (
                <TableRow key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.deviceName}
                  </TableCell>
                  <TableCell numeric>{n.minPrice}</TableCell>
                  {this.renderStatus(n.status)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>);
  }
}

export default SearchTable;
