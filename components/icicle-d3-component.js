import React from 'react';
import D3Component from 'idyll-d3-component';
import * as d3 from 'd3';

const size = 600

let element

class IcicleD3Component extends D3Component {
  initialize(node, props) {
    let root = d3.hierarchy(props.data);

    root.eachAfter(
      d => d.value = d.children ? d.children.reduce(
        (sum, child) => sum + child.value
        , 0
      ) : d.data.size
    )

    d3.partition()
      .size([600, 600])
      (root);

    const svg = (this.svg = d3.select(node).append('svg'));
    svg
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("class", "icicle-plot")

    element = svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

    element.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)

    element.append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text(d => d.data.name.substring(0, (d.x1 - d.x0) / 10))
  }

  update(props, oldProps) {
    element.selectAll("rect")
      .transition()
      .duration(props.config.animationDuration)
      .style("fill", d => props.index > 0 ? props.config.fileTypeColors[d.data.name.split(".")[1]] : "black")
  }
}

export default IcicleD3Component;
