import React from "react";
import * as d3 from "d3";
import groups from "../services/groups";

import { cloneDeep, uniq } from "lodash/fp";

class HorizontalBarChart extends React.Component {
  componentDidMount() {
    this.chart = this.drawGraph(cloneDeep(this.props.data || []));
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.chart.updateData(cloneDeep(nextProps.data || []));
    }

    return false;
  }

  render() {
    return <div className="horizontal_bar_chart_container" />;
  }

  /**
   * D3 world
   **/
  drawGraph(data) {
    const WIDTH = 221;
    const HEIGHT = 150;
    const LEFT_RIGHT_PADDING = 12;
    const TOP_BOTTOM_PADDING = 0;
    const MARGIN = { top: 0, right: 0, bottom: 0, left: 40 };

    const partyList = groups.getPartyList();

    const fillDataWithZeroes = data => {
      partyList.forEach(party => {
        if (!data.find(value => value.party === party)) {
          data.push({
            party,
            specificity_score: 0
          });
        }
      });
    };

    fillDataWithZeroes(data);

    const x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([MARGIN.left, WIDTH - MARGIN.right]);

    const y = d3
      .scaleBand()
      .range([MARGIN.top, HEIGHT - MARGIN.bottom])
      .padding(0.4)
      .domain(uniq(data.map(d => d.party)));

    const yAxis = g => {
      g
        .attr("transform", `translate(${MARGIN.left},0)`)
        // Following is necessary to prevent the domain
        // from showing up during transitions
        .style("stroke-width", "0px")
        .call(
          d3
            .axisLeft(y)
            .tickSize(0)
            .tickFormat(d => groups.getPartyName(d))
        )
        .selectAll("text")
        .style("fill", "grey")
        .style("font-family", "Roboto")
        .style("font-size", "12px");
      g.select(".domain").remove();
    };

    const svg = d3
      .select("div.horizontal_bar_chart_container")
      .append("svg")
      .attr("width", WIDTH + 2 * LEFT_RIGHT_PADDING)
      .attr("height", HEIGHT + 2 * TOP_BOTTOM_PADDING);

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", d3.rgb(240, 240, 240))
      .attr("x", x(0))
      .attr("y", d => y(d.party) - 3)
      .attr("width", () => x(1) - x(0))
      .attr("height", y.bandwidth() + 6);

    const valuesRectGroup = svg.append("g");

    valuesRectGroup
      .selectAll("rect")
      .data(data, d => d.party)
      .join("rect")
      .attr("fill", d => groups.getPartyColor(d.party))
      .attr("fill-opacity", 0.8)
      .attr("x", x(0))
      .attr("y", d => y(d.party))
      .attr("width", d => x(d.specificity_score) - x(0))
      .attr("height", y.bandwidth());

    const yAxisGroup = svg.append("g").call(yAxis);

    const updateData = data => {
      const t = d3.transition().duration(750);
      fillDataWithZeroes(data);

      y.domain(uniq(data.map(d => d.party)));

      valuesRectGroup
        .selectAll("rect")
        .data(data, d => d.party)
        .join("rect")
        .transition(t)
        .attr("fill", d => groups.getPartyColor(d.party))
        .attr("y", d => y(d.party))
        .attr("width", d => x(d.specificity_score) - x(0))
        .attr("height", y.bandwidth());

      yAxisGroup.transition(t).call(yAxis);
    };

    return { updateData };
  }
}

export default HorizontalBarChart;
