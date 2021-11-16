import * as d3 from "d3";

//title,xTitle,yTitle are strings for the labels for the graph, x and y axis
var createLabels = function (
  screen,
  margins,
  graph,
  target,
  title,
  xtitle,
  ytitle
) {
  var labels = d3.select(target).append("g").classed("labels", true);

  labels
    .append("text")
    .text(title)
    .classed("title", true)
    .attr("text-anchor", "middle")
    .attr("x", margins.left + graph.width / 2)
    .attr("y", margins.top / 2);

  labels
    .append("text")
    .text(xtitle)
    .classed("label", true)
    .attr("text-anchor", "middle")
    .attr("x", margins.left + graph.width / 2)
    .attr("y", screen.height - 10);

  labels
    .append("g")
    .attr("transform", "translate(20," + (margins.top + graph.height / 2) + ")")
    .append("text")
    .text(ytitle)
    .classed("label", true)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(90)");
};

var createAxes = function (screen, margins, graph, target, xScale, yScale) {
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale).ticks(6);

  var axes = d3.select(target).append("g").classed("axes", true);
  var xGroup = axes
    .append("g")
    .attr(
      "transform",
      "translate(" + margins.left + "," + (margins.top + graph.height) + ")"
    )
    .call(xAxis)
    .classed("xaxis", true);

  axes
    .append("g")
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
    .call(yAxis)
    .classed("yaxis", true);
};

// Draw Bars

var drawbarcharts = function (
  childlessdata,
  graph,
  target,
  ageScale,
  ChildScale
) {
  var rects = d3
    .select(target)
    .select(".graph")
    .selectAll("rect")
    .data(childlessdata)
    .enter()
    .append("g");

  rects
    .append("rect")
    .attr("x", function (data) {
      return ageScale(data.age);
    })
    .attr("width", function (data) {
      return ageScale.bandwidth();
    })
    .attr("y", function (data) {
      return ChildScale(100 - data.childless);
    })
    .attr("height", function (data) {
      return graph.height - ChildScale(100 - data.childless);
    })
    .style("fill", "blue");

  rects
    .append("text")
    .attr("x", function (data) {
      return ageScale(data.age);
    })
    .attr("width", function (data) {
      return ageScale.bandwidth;
    })
    .attr("y", function (data) {
      return ChildScale(100 - data.childless);
    })
    .attr("height", function (data) {
      return graph.height - ChildScale(100 - data.childless);
    })
    .text(function (data) {
      return data.age;
    });
};

/*
childless is an array of age categories and the percentage of women childless 
target is a string selector to indicate which svg to put things into

*/
var initGraphs = function (childless, target) {
  //the size of the screen
  var screen = { width: 600, height: 400 };

  //how much space will be on each side of the graph
  var margins = { top: 40, bottom: 70, left: 90, right: 40 };

  //generated how much space the graph will take up
  var graph = {
    width: screen.width - margins.left - margins.right,
    height: screen.height - margins.top - margins.bottom
  };

  //set the screen size
  d3.select(target).attr("width", screen.width).attr("height", screen.height);

  //create a group for the graph
  var g = d3
    .select(target)
    .append("g")
    .classed("graph", true)
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

  //Need to create scales here
  var childlessAge = childless.map(getAgeValues);
  console.log("ages", childlessAge);
  var childlessRate = childless.map(getRate);
  var maxRate = d3.max(childlessRate);
  console.log(maxRate);

  var ageScale = d3
    .scaleBand()
    .domain(childlessAge)
    .range([0, graph.width])
    .padding(0.1);

  var childScale = d3
    .scaleLinear()
    .domain([0, maxRate])
    .range([graph.height, 0]);

  //while these function are already written the parameters might not be properly set
  //be sure to read what they want and provide it in the parameters.
  createLabels(
    screen,
    margins,
    graph,
    target,
    "Women with Children",
    "Age Range",
    "Percentage of Women with Children"
  );
  createAxes(screen, margins, graph, target, ageScale, childScale);
  drawbarcharts(childless, graph, target, ageScale, childScale);
};

var getAgeValues = function (data) {
  return data.age;
};
var getRate = function (data) {
  return Number(data.childless);
};
var successFcn = function (data) {
  console.log("Success");

  var target = "#comparison";

  initGraphs(data, target);
};

var failFcn = function (errorMsg) {
  console.log("Error: ", errorMsg);
};

var childlessPromise = d3.csv("data/childless_women.csv");

childlessPromise.then(successFcn, failFcn);
