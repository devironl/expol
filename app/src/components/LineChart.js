import React from "react";
import PropTypes from "prop-types";

import * as d3 from "d3";
import {
  flatMap,
  flow,
  get,
  last,
  map,
  uniqueId,
  values as extractObjectValues
} from "lodash/fp";

import groups from "../services/groups";
import { freqToFormattedPerCount } from "../services/frequency";

const yearIntToDate = yearInt => d3.timeParse("%Y")(yearInt.toString());
class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.divId = uniqueId("line-chart-");
  }

  componentDidMount() {
    const { data } = this.props;

    data.sort((a, b) => a.year - b.year);
    const dates = this.getDates(data);
    const values = this.getValues(data);

    this.chart = this.drawGraph(this.divId, dates, values, this.props.series);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.series !== this.props.series
    ) {
      const { data, series } = nextProps;
      data.sort((a, b) => a.year - b.year);
      const values = this.getValues(data);
      this.chart && this.chart.updateChart(values, series);
    }

    return false;
  }

  getDates = map(flow(get("year"), yearIntToDate));

  getValues = map(get("values"));

  render() {
    return <div id={this.divId} />;
  }

  /**
   * D3 world
   **/
  drawGraph(divId, dates, values, series) {
    const WIDTH = 220;
    const HEIGHT = 90;
    const MARGIN = { top: 15, right: 15, bottom: 25, left: 15 };

    const getAllValuesList = flatMap(valuesObj =>
      extractObjectValues(valuesObj)
    );
    const getMaxValue = values => d3.max(getAllValuesList(values));
    const getLastValue = series => flow(last, get(series));

    const x = d3
      .scaleTime()
      .domain(d3.extent(dates))
      .range([MARGIN.left, WIDTH - MARGIN.right]);

    const xAxis = g => {
      g.attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`).call(
        d3
          .axisBottom(x)
          .tickValues(dates)
          .tickSizeOuter(0)
          .tickSizeInner(3)
      );

      g.select(".domain").remove();
      g
        .selectAll("text")
        .style("fill", "grey")
        .style("text-anchor", "end")
        .attr("dy", ".6em")
        .attr("transform", "rotate(-30)");
    };

    const svg = d3
      .select(`#${divId}`)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

    svg.append("g").call(xAxis);

    const y = d3
      .scaleLinear()
      .nice()
      .range([HEIGHT - MARGIN.bottom, MARGIN.top])
      .domain([0, getMaxValue(values)]);

    const getLineData = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d, i) => x(dates[i]))
      .y(d => y(get(series)(d)));

    const getAreaData = d3
      .area()
      .curve(d3.curveCatmullRom)
      .x((d, i) => x(dates[i]))
      .y0(y(0))
      .y1(d => y(get(series)(d)));

    const area = svg
      .append("path")
      .attr("fill", groups.getPartyColor(series) || "lightgrey")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "none")
      .attr("d", getAreaData(values));

    const line = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("stroke", groups.getPartyColor(series) || "lightgrey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", getLineData(values));

    const dotsGroup = svg.append("g");

    dotsGroup
      .selectAll("circle")
      .data(values)
      .join("circle")
      .attr("r", 3)
      .attr("fill", groups.getPartyColor(series) || "grey")
      .attr("cx", (d, i) => x(dates[i]))
      .attr("cy", d => y(get(series)(d)));

    const legend = svg
      .append("text")
      .text(freqToFormattedPerCount(getLastValue(series)(values)))
      .style("text-anchor", "end")
      .attr("font-size", 10)
      .attr("x", x(last(dates)))
      .attr("y", y(getLastValue(series)(values)))
      .attr("dy", "-.6em");

    const updateChart = (values, series) => {
      y.domain([0, getMaxValue(values)]);

      getAreaData.y0(y(0)).y1(d => y(get(series)(d)));
      getLineData.y(d => y(get(series)(d)));

      dotsGroup
        .selectAll("circle")
        .data(values)
        .join("circle")
        .transition()
        .attr("cy", d => y(get(series)(d)))
        .attr("fill", groups.getPartyColor(series) || "lightgrey");

      line
        .transition()
        .attr("d", getLineData(values))
        .attr("stroke", groups.getPartyColor(series) || "lightgrey");

      area
        .transition()
        .attr("d", getAreaData(values))
        .attr("fill", groups.getPartyColor(series) || "lightgrey");

      legend
        .transition()
        .text(freqToFormattedPerCount(getLastValue(series)(values)))
        .attr("y", y(getLastValue(series)(values)));
    };

    return { updateChart };
  }
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  series: PropTypes.string.isRequired
};

export default LineChart;
