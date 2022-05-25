// Adapted from https://observablehq.com/@d3/sunburst

import D3Component from "idyll-d3-component";
import * as d3 from "d3";

const width = 600
const radius = width/2
const padding = 1

let element, root

class SunburstD3Component extends D3Component {
  initialize(node, props) {
    
    const svg = (this.svg = d3.select(node).append("svg"));
    svg
      .attr("viewBox", [
        -width / 2,
        -width / 2,
        width,
        width
      ])
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("class", "sunburst-plot")

    root = d3.hierarchy(props.data);

    root.eachAfter(
      d => d.value = d.children ? d.children.reduce(
        (sum, child) => sum + child.value
        , 0
      ) : d.data.size
    )

    d3.partition()
      .size([2 * Math.PI, radius])
      (root);

    element = svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 2 * padding / radius))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - padding);

    element.append("path")
      .attr("d", arc)
      .style("fill", d => props.config.fileTypeColors[d.data.name.split(".")[1]])

    element.append("text")
      .filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10)
      .attr("transform", d => {
        if (!d.depth) return
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI
        const y = (d.y0 + d.y1) / 2
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
      })
      .attr("dy", "0.1em")
      .text(d => d.data.name)
  }

  update(props, oldProps) {
  }
}

export default SunburstD3Component;
