import React from 'react';
import D3Component from 'idyll-d3-component';
import * as d3 from 'd3';

const maxSize = 600
const maxHeight = 200

let svg, element, root, width

class IcicleLargeD3Component extends D3Component {
  initialize(node, props) {

    width = Math.min(maxSize, window.innerWidth)

    svg = (this.svg = d3.select(node).append('svg'))
      .attr("viewBox", `0 0 ${width} ${maxHeight}`)
      .attr("preserveAspectRatio", "none")
      .attr("class", "icicle-plot")

    let data = {
      name: "file-copies",
      children: []
    }
    for (var i = 0; i < 50; i++) {
      data.children.push(props.data)
    }

    root = d3.hierarchy(data);

    root.eachAfter(
      d => d.value = d.children ? d.children.reduce(
        (sum, child) => sum + child.value
        , 0
      ) : d.data.size * Math.random() * Math.random() * Math.random() * 10
    )

    d3.partition()
      .size([width, maxHeight])
      (root);

    console.log(root)

    svg.append("linearGradient")
      .attr("id", "gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 15).attr("y2", 0)
      .selectAll("stop")
      .data([
        { offset: "0%", color: "white" },
        { offset: "100%", color: "gray" }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)

    element = svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)

    element.append("rect")
      .attr("width", d => d.x1 - d.x0 + 1)
      .attr("height", d => d.y1 - d.y0 - 1)
      .attr("opacity", d => 0.5 - d.depth * 0.08)
      .style("fill", d => props.config.fileTypeColors[d.data.name.split(".")[1]])

    element.append("rect")
      .attr("class", "gradient")
      .attr("width", d => d.x1 - d.x0 + 1)
      .attr("height", d => d.y1 - d.y0 - 1)
      .attr("opacity", 0.2)

    element.append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text(d => d.data.name.substring(0, (d.x1 - d.x0) / 10))
  }

  update(props, oldProps) {
    const zoom = props.zoom / 100
    const scroll = props.scroll / 1000 * width
    element = svg.selectAll("g")
      .attr("transform", d => `translate(${(d.x0 - scroll) * zoom},${d.y0})`)

    element.selectAll("rect")
      .attr("width", d => (d.x1 - d.x0) * zoom + 1)

    element.selectAll("text")
      .text(d => d.data.name.substring(0, (d.x1 - d.x0) * zoom / 10))
  }
}

export default IcicleLargeD3Component;
