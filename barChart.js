var margin = {"top": 20, "right": 30, "bottom": 50, "left": 30 }
var width = 1000;
var height = 500;
var rectWidth = 100;
var shooting_data = d3.json("police_shooting.json");
var races = ["Mon","Tues","Wed","Thurs","Fri","Sat","Sun"]
shooting_data.then((result)=>{
    var grouped = result.reduce(function (r, a) {
        r[a.race] = r[a.race] || [];
        r[a.race].push(a);
        return r;
    }, Object.create(null));

    console.log(grouped);
    var data = []
    var keys = []
    Object.keys(grouped).map((key) => {
        var element = grouped[key]
        data.push([element.length, getRandomColor()])
    });
    console.log("Keys", keys)
    // scales
    var xMax = data.length * rectWidth;
    var xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([margin.left, width - margin.right]);
    console.log("AXIS", xScale)
    var yMax = d3.max(data, function(d){return d[0]});
    var yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([height - margin.bottom, margin.top]);
    
    // svg element
    var svg = d3.select("div#barChart").append("svg")
    
    // bars 
    var rect = svg.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('x', function(d, i){
            return xScale(i * rectWidth)
        })
        .attr('y', function(d){
            return yScale(d[0])
        })
        .attr('width', xScale(rectWidth) - margin.left)
        .attr('height', function(d){
            return height - margin.bottom - yScale(d[0])
        })
        .attr('fill', function(d){
            return d[1]
        })
        .attr('margin', 0);
    
    console.log(xScale)
    // axes
    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(d3.format('d'));
    
    svg.append('g')
        .attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
        .call(xAxis);
    svg.append('g')
        .attr('transform', 'translate(' + [margin.left, 0] + ')')
        .call(yAxis);
})

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// data

