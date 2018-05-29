import React from 'react';

import TitleBar from '../Common/TitleBar.jsx';

class Search extends React.Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <TitleBar title='Search for Availible Devices'/>
    );
  }
}

export default Search;
