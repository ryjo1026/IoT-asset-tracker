import React from 'react';
import TextField from '@material-ui/core/TextField';


// Stateless TextField that only excepts Natural Numbers
class NaturalNumberInput extends React.Component {
  constructor(props, context) {
    super(props);

    this.updateVal = this.updateVal.bind(this);
  }

  updateVal(e) {
    let newVal;
    if (e.target.value < 0) {
      // No negatives
      newVal = 0;
    } else if (e.target.value % 1 !== 0) {
      // No decimals or fractions
      newVal = Math.floor(e.target.value);
    } else {
      // Normal number handling
      newVal = e.target.value;
    }
    // Auto convert to lowercase vatriable names
    let label = this.props.label.toLowerCase();
    this.props.onFormChange(label, newVal);
  }

  render() {
    return (
      <div className='NaturalNumberInput'>
        <TextField
            label={this.props.label}
            disabled={this.props.disabled}
            onChange={this.updateVal}
            value={this.props.value}
            type="number"
            margin="normal"/>
      </div>
    );
  }
}

export default NaturalNumberInput;
