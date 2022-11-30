import React, { Component } from 'react';
import 'react-sortable-tree/style.css';
import SortableTree from 'react-sortable-tree';
import { connect } from 'react-redux';
import Loading from '../loading';

class ChartTree extends Component {
  constructor() {
    super();
    this.state = {
      treeData: [],
    };
  }

  componentDidMount() {
    this.setState({ treeData: this.props.chartTree });
  }

  componentWillReceiveProps(next) {
    this.setState({ treeData: next.chartTree });
  }
  render() {
    if (this.props.accountChartLoading) {
      return <Loading />;
    }
    return (
      <div style={{ height: 500 }}>
        <SortableTree
          canDrag={false}
          treeData={this.state.treeData}
          onChange={(treeData) => this.setState({ treeData })}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chartTree: state.account.accChartTree,
    chartLoading: state.account.accountChartLoading,
  };
}

export default connect(mapStateToProps)(ChartTree);
