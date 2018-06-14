// sorts decreasing, to make it increasing:
// sort (function (x, y) {
//   return x.a - y.a
// })
function zip(a, b) {
  var zipped = [];
  // zip
  for (var i=0; i<a.length; i++) {
    zipped.push({a: a[i], b: b[i] });
  }
  zipped.sort(function (x, y){
    return y.a - x.a;
  });
  
  var c = []
  var d = []
  
  for (var i=0; i < zipped.length; i++) {
      c[i] = zipped[i].a
      d[i] = zipped[i].b
  }
  return [c,d]
}

function makeWaterfall(names, nums) {

  var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 80
  };


  var width = 700;
  var height = 300;

  var maxNum = d3.max(nums)
  var zipped = zip(nums, names)
  nums = zipped[0]
  names = zipped[1]

 
  // Add the svg canvas
  var svg = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
      .attr("fill", "white");


  // graph title
  var graphTitle = svg.append("text")
    .attr("text-anchor", "middle")
    .attr("fill","black")
    .attr("dy", 0)
    .style("font-size", "20px")
    .attr("transform", "translate("+ (width/2.2) +","+ -50 +")")
    .text("A waterfall plot")


  //append everything to this
  var plot = svg.append("g")

  //set range for data by domain, and scale by range
  var xrange = d3.scale.linear()
  .domain([0, names.length])
  .range([0, width]);

  var yrange = d3.scale.linear()
  .domain([d3.min(nums), maxNum])
  .range([height, 0]);

  //set axes for graph
  var xAxis = d3.svg.axis()
  .scale(xrange)
  .orient("bottom")
  .tickFormat(function(d,i){ return names[i] })
  .tickValues(d3.range(names.length));

  var yAxis = d3.svg.axis()
  .scale(yrange)
  .orient("left")
  .tickFormat(d3.format("0.2f"));

  // Add the Y Axis
  var yAxisBar = plot.append("g")
    .attr("class", "y axis")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("transform", function() {
      if (d3.min(nums) > 0) {
        return "translate(0," + (yrange(0)-height) + ")"
      }})
    .call(yAxis)
    .selectAll("text")
      .style("font-size", 13)

  // Add the X Axis
  var xAxisBar = plot.append("g")
    .attr("class", "x axis")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("transform", function() {
      if (d3.min(nums) > 0) {
        return "translate(0," + yrange(0) + ")"
      } else {
        return "translate(0," +  yrange(0) + ")"
      }
    })
    .call(xAxis)

    xAxisBar.selectAll("text")
    .style("text-anchor", function(d,i) {
      if (nums[i] >= 0) {
        return "end"
      } else {
        return "start"
      }
    })
    .style("font-size", "11px")
    .attr("dx", function(d,i) {
      if (nums[i] >= 0) {
        return "-1em"
      } else {
        return "1em"
      }
    })
    .attr("transform", "rotate(-90)" )
    .attr("dy", 5)
    .attr("y", (width/nums.length)/2)
    .attr("fill", "#207cc1")
    .attr("stroke", "none")
      .append("svg:title")
        .text(function(d,i) {return names[i]});

    
  plot.selectAll(".tick")
  .select("text")
  .attr("fill", "black")
  .attr("stroke", "none")


  //adding chart
  var chart = plot.append('g')
    .attr('id','bars')


  // adding each bar
  chart.selectAll('.bar')
    .data(nums)
    .enter()
    .append('rect')
      .attr("class", "bar")
      .style("stroke", "none")
      .attr('height', function(d) {return Math.abs(yrange(d) - yrange(0));})
      .attr({
        'x':function(d,i) { return xrange(i)},
        'y':function(d) { return yrange(Math.max(0,d))} // to determine if we should flip the bar or not
      })
      .attr("width", width/nums.length - 3)
      .style('fill', "#2d5faf")

}
