import React from 'react';
import D3Component from 'idyll-d3-component';
import * as d3 from 'd3';

const size = 600
const elementHeight = 35
const indentation = 40
const lineOffsetX = 23
const lineOffsetY = 10

let element

class IndentedD3Component extends D3Component {
  initialize(node, props) {
    let root = d3.hierarchy(props.data);

    root.eachAfter(
      d => d.size = d.children? d.children.reduce(
        (sum, child) => sum + child.size
        , 0
      ): d.data.size
    )

    root.sum(d => 1)

    let nodeArray = []
    root.eachBefore(d => nodeArray.push(d))

    const svg = (this.svg = d3.select(node).append('svg'));
    svg
      .attr("viewBox", `0 0 ${size} ${size}`)
      .attr("class", "indented-plot")

    element = svg.selectAll("g")
      .data(nodeArray)
      .enter()
      .append("g")
      .attr("transform", (d, i) =>
        `translate(${(d.depth + 1) * indentation},${(i + 1) * elementHeight})`
      )

    element.append("text")
      .text(d => d.data.name)

    element.append("line")
      .style("opacity", 0)
      .attr("x1", lineOffsetX)
      .attr("y1", lineOffsetY)
      .attr("x2", lineOffsetX)
      .attr("y2", d =>
        (d.value - 1) * elementHeight + lineOffsetY
      )

    element.append("circle")
      .style("opacity", 0)
      .attr("cx", -16.75)
      .attr("cy", -6)
      .attr("r", 5)
  }

  update(props, oldProps) {
    element.selectAll("line")
      .transition()
      .duration(props.config.animationDuration)
      .style("opacity", props.index > 0 ? 0.3 : 0)

    element.selectAll("circle")
      .transition()
      .duration(props.config.animationDuration)
      .style("opacity", props.index > 1 ? 1 : 0)
      .style("fill", d => props.index > 2 ? props.config.fileTypeColors[d.data.name.split(".")[1]] : "black")
      .attr("r", d => props.index > 3 ? Math.sqrt(d.size * 5) : 5)
  }
}

export default IndentedD3Component;
