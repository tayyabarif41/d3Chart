var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("div#barChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
// update = chart.update(order)
d3.json("police_shooting.json").then(function(data) {
  // format the data
    var grouped = data.reduce(function (r, a) {
        r[a.race] = r[a.race] || [];
        r[a.race].push(a);
        return r;
    }, Object.create(null));

    console.log(grouped);
    var data = []
    Object.keys(grouped).map((key) => {
        var element = grouped[key]
        if(key == 'W'){
          data.push([element.length, "White, non-Hispanic"])
        }
        if(key == 'B'){
          data.push([element.length, "Black, non-Hispanic"])
        }
        if(key == 'A'){
          data.push([element.length, "Asian"])
        }
        if(key == 'N'){
          data.push([element.length, "Native American"])
        }
        if(key == 'H'){
          data.push([element.length, "Hispanic"])
        }
        if(key == 'O'){
          data.push([element.length, "Other"])
        }
        if(key == ''){
          data.push([element.length, "Unknown"])
        }
    });
    console.log("Data", data)
  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d[1]; }));
  y.domain([0, d3.max(data, function(d) { return d[0]; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[1]); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[0]); })
      .attr("height", function(d) { return height - y(d[0]); });
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  d3.select("#ascending").on("click", function() {
    console.log("SORTING", data)
    data.sort(function(a, b) {
      return d3.ascending(a[0], b[0])
    })
    x.domain(data.map(function(d) {
      return d[1];
    }));
    svg.select("g")
      .call(d3.axisBottom(x));
    svg.selectAll(".bar")
      .transition()
      .duration(500)
      .attr("x", function(d, i) {
        return x(d[1]);
    })

    // svg.selectAll(".val-label")
    //   .transition()
    //   .duration(500)
    //   .attr("x", function(d, i) {
    //     return x(d[1]) + x.bandwidth() / 2;
    // })

    // svg.selectAll(".bar-label")
    //   .transition()
    //   .duration(500)
    //   .attr("transform", function(d, i) {
    //     return "translate(" + (x(d[1].key) + x.bandwidth() / 2 - 8) + "," + (height + 15) + ")" + " rotate(45)"
    //   })
    })

    d3.select("#descending").on("click", function() {
      console.log("SORTING" , data)
      data.sort(function(a, b) {
        return d3.ascending(b[0], a[0])
      })
     x.domain(data.map(function(d) {
      return d[1];
    }));
    svg.select("g")
      .call(d3.axisBottom(x));
      svg.selectAll(".bar")
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
          return x(d[1]);
      })
    })

});

