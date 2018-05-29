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
    this.props.updateRegisterForm(this.props.label, newVal);
  }

  render() {
    return (
      <div className='NaturalNumberInput'>
        <TextField
            label={this.props.label}
            onChange={this.updateVal}
            value={this.props.value}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
        />
      </div>
    );
  }
}

export default NaturalNumberInput;
