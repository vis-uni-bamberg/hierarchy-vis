import React from 'react';
import D3Component from 'idyll-d3-component';
import * as d3 from 'd3';

const size = 600;

class IndentedD3Component extends D3Component {
  initialize(node, props) {
    const svg = (this.svg = d3.select(node).append('svg'));
    svg
      .attr('viewBox', `0 0 ${size} ${size}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg
      .append('text')
      .attr('x', 10)
      .attr('y', 10)
      .text('...')
  }

  update(props, oldProps) {
  }
}

export default IndentedD3Component;
