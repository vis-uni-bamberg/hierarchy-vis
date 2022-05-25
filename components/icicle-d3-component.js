import React from 'react';
import D3Component from 'idyll-d3-component';
import * as d3 from 'd3';

const maxSize = 600

let element, root, width

class IcicleD3Component extends D3Component {
  initialize(node, props) {

    width = Math.min(maxSize, window.innerWidth)

    const svg = (this.svg = d3.select(node).append('svg'));
    svg
      .attr("viewBox", `0 0 ${width} ${maxSize}`)
      .attr("class", "icicle-plot")

    root = d3.hierarchy(props.data);

    root.count()

    d3.partition()
      .size([width, maxSize])
      (root);

    console.log(root)

    element = svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

    element.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("opacity", d => 0.5 - d.depth * 0.08)

    element.append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text(d => d.data.name.substring(0, (d.x1 - d.x0) / 10))
  }

  update(props, oldProps) {

    if (props.index > 1) {
      root.eachAfter(
        d => d.value = d.children ? d.children.reduce(
          (sum, child) => sum + child.value
          , 0
        ) : d.data.size
      )
    } else {
      root.count()
    }

    d3.partition()
      .size([width, maxSize])
      (root);

    element
      .transition()
      .duration(props.config.animationDuration)
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

    element.selectAll("rect")
      .transition()
      .duration(props.config.animationDuration)
      .attr("width", d => d.x1 - d.x0)
      .style("fill", d => props.index > 0 ? props.config.fileTypeColors[d.data.name.split(".")[1]] : "black")

    element.selectAll("text")
      .text(d => d.data.name.substring(0, (d.x1 - d.x0) / 10))
  }
}

export default IcicleD3Component;
