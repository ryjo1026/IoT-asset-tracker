import React from 'react';
import PropTypes from 'prop-types';

import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export default class SearchTableHeader extends React.Component {
  constructor(props, context) {
    super(props);

    this.createSortHandler = this.createSortHandler.bind(this);
  }

  createSortHandler(property) {
    return function(event) {
      this.props.onRequestSort(event, property);
    }.bind(this);
  };

  render() {
    return (
      <TableHead>
        <TableRow>
          {this.props.columnData.map((column) => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection=
                  {this.props.orderBy === column.id ? this.props.order:false}>
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}>
                <TableSortLabel
                    active={this.props.orderBy === column.id}
                    direction={this.props.order}
                    onClick={this.createSortHandler(column.id)}>
                    {column.label}
                </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>);
  }
}
SearchTableHeader.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  columnData: PropTypes.array.isRequired,
  orderBy: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
};
