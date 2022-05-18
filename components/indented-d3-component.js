import React from 'react';
import D3Component from 'idyll-d3-component';
import * as d3 from 'd3';

const size = 600;

class IndentedD3Component extends D3Component {
  initialize(node, props) {
    var root = d3.hierarchy({
      name: "rootNode",
      children: [
        {
          name: "child1"
        },
        {
          name: "child2",
          children: [
            { name: "grandChild1" },
            { name: "grandChild2" },
            { name: "grandChild3" },
            { name: "grandChild4" }
          ]
        },
        {
          name: "child3",
          children: [
            { name: "grandChild5" },
            { name: "grandChild6" },
          ]
        }
      ]
    });

    const svg = (this.svg = d3.select(node).append('svg'));
    svg.attr('viewBox', `0 0 ${size} ${size}`)

    svg.selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("transform", (d, i) => `translate(${d.depth * 50},${i * 50})`)
      .text(d => d.data.name)

  }

  update(props, oldProps) {
  }
}

export default IndentedD3Component;
