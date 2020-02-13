import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import groups from "../services/groups";

import { cloneDeep, uniqueId, get } from "lodash/fp";

class ForceBubbleChartCollide extends React.Component {
  constructor(props) {
    super(props);

    this.divId = uniqueId("force-bubble-chart-");
  }

  componentDidMount() {
    // D3 mutates the data so pass a clone
    this.chart = this.drawGraph(
      `#${this.divId}`,
      cloneDeep(this.props.data),
      this.props.handleLemmaSelection,
      this.props.sizeAttribute,
      this.props.sizeOrderReversed,
      this.props.type
    );
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id={this.divId} />;
  }

  /**
   * D3 world
   **/
  drawGraph(selector, data, handleLemmaSelection, sizeAttribute, sizeOrderReversed, type) {
    // Constants for sizing
    const WIDTH = 692;
    const HEIGHT = 400;
    const MIN_RADIUS = 30;
    const MAX_RADIUS = 45;
    const TOP_PADDING = 4;
    const X_FORCE_STRENGTH = 0.01;
    const Y_FORCE_STRENGTH = 0.03;

    const createUniqueIdObject = type => {
      const uid = uniqueId(type);

      return {
        id: uid,
        href: `#${uid}`
      };
    };

    const getSizeAttribute = get(sizeAttribute);
    const getColor = d => groups.getPartyColor(d.party);

    const center = { x: WIDTH / 2, y: HEIGHT / 2 };

    const partyCenters = {};
    const partyList = groups.getPartyList();
    partyList.forEach((party, i) => {
      partyCenters[party] = {
        x: (i + 1) * WIDTH / (partyList.length + 1),
        y: HEIGHT / 2
      };
    });

    const simulation = d3
      .forceSimulation()
      .velocityDecay(0.2)
      .force(
        "x",
        d3
          .forceX()
          .strength(X_FORCE_STRENGTH)
          .x(nodeXPos)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(Y_FORCE_STRENGTH)
          .y(nodeYPos)
      )
      .force("collide", d3.forceCollide().radius(d => d.radius + 1))
      .on("tick", ticked);

    // @v4 Force starts up automatically,
    //  which we don't want as there aren't any nodes yet.
    simulation.stop();

    const formatData = rawData => {
      const minAmount = d3.min(rawData, getSizeAttribute);

      const maxAmount = d3.max(rawData, getSizeAttribute);

      const radiusScale = d3
        .scalePow()
        .exponent(0.5)
        .range([MIN_RADIUS, MAX_RADIUS])
        .domain(!!sizeOrderReversed ? [minAmount, maxAmount] : [maxAmount, minAmount]);

      const initNodes = rawData.map(function(d) {
        return {
          radius: radiusScale(getSizeAttribute(d)),
          x: nodeXPos(d),
          y: Math.random() * HEIGHT,
          ...d
        };
      });

      // sort them to prevent occlusion of smaller nodes.
      initNodes.sort(function(a, b) {
        return b.radius - a.radius;
      });

      return initNodes;
    };

    const nodes = formatData(data);

    const svg = d3
      .select(selector)
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("font-size", 12)
      .attr("font-family", "Roboto")
      .attr("text-anchor", "middle");

    const bubblesSelection = svg.selectAll(".bubble").data(nodes, d => d.id);

    const bubbleGroups = bubblesSelection.enter().append("g");

    const bubblesEntered = bubbleGroups
      .append("circle")
      .classed("bubble", true)
      .attr("cursor", "pointer")
      .attr("id", d => (d.bubbleUid = createUniqueIdObject("bubble")).id)
      .attr("r", 0)
      .attr("fill", getColor)
      .attr("fill-opacity", 0.8)
      .on("mouseover", showDetail)
      .on("mouseout", hideDetail)
      .on("click", d =>
        handleLemmaSelection({
          id: d.lemma_id,
          display_word: d.display_word
        })
      );

    const bubbles = bubblesSelection.merge(bubblesEntered);

    bubbles
      .transition()
      .duration(2000)
      .attr("r", function(d) {
        return d.radius;
      });

    simulation.nodes(nodes);

    bubbleGroups
      .append("clipPath")
      .attr("id", d => (d.clipUid = createUniqueIdObject("clip")).id)
      .append("use")
      .attr("xlink:href", d => d.bubbleUid.href);

    const bubbleText = bubbleGroups
      .append("text")
      .attr("fill", "white")
      .attr("font-weight", "500")
      .attr("id", d => (d.textUid = createUniqueIdObject("text")).id)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("clip-path", d => `url(${d.clipUid.href})`);

    const bubbleTextParts = bubbleText
      .selectAll("tspan")
      .data(d =>
        d.display_word.split(" ").map(wordPart => ({
          wordPart,
          parentDatum: d
        }))
      )
      .enter()
      .append("tspan")
      .attr("x", d => d.parentDatum.x)
      .attr("y", d => d.parentDatum.y)
      .attr("dy", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d.wordPart)
      .style("pointer-events", "none");

    // Set initial
    simulation.alpha(1).restart();

    function ticked() {
      bubbles
        .attr(
          "cx",
          d => (d.x = Math.max(MAX_RADIUS, Math.min(WIDTH - MAX_RADIUS, d.x)))
        )
        .attr(
          "cy",
          d =>
            (d.y = Math.max(
              MAX_RADIUS + TOP_PADDING,
              Math.min(HEIGHT - MAX_RADIUS, d.y)
            ))
        );

      bubbleText.attr("x", d => d.x).attr("y", d => d.y);

      bubbleTextParts
        .attr("x", d => d.parentDatum.x)
        .attr("y", d => d.parentDatum.y);
    }

    function nodeXPos(d) {
      return type === "party" ? partyCenters[d.party].x : center.x;
    }

    function nodeYPos(d) {
      return type === "party" ? partyCenters[d.party].y : center.y;
    }

    function showDetail(d) {
      d3.select(this).attr("stroke", "lightgrey");

      svg
        .append("use")
        .attr("id", "temporary-to-bring-front")
        .attr("href", `#${d.textUid.id}`);

      d3
        .select(`#${d.textUid.id}`)
        .attr("fill", d3.color('rgba(0, 0, 0, 0.87)'))
        .attr("font-size", 18)
        .attr("font-weight", "400")
        .attr("clip-path", "");
    }

    function hideDetail(d) {
      d3.select(this).attr("stroke", "none");

      d3
        .select(`#${d.textUid.id}`)
        .attr("fill", "white")
        .attr("font-size", 12)
        .attr("font-weight", "500")
        .attr("clip-path", d => `url(${d.clipUid.href})`);

      svg.selectAll("#temporary-to-bring-front").remove();
    }
  }
}

ForceBubbleChartCollide.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOf(["party", "centered"]).isRequired,
  sizeAttribute: PropTypes.string.isRequired
};

export default ForceBubbleChartCollide;
