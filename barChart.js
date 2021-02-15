var margin = {"top": 20, "right": 10, "bottom": 20, "left": 30 }
    var width = 700;
    var height = 700;
    var rectWidth = 200;
    
    // data
    var data = [[50, "red"], [100, "teal"], [125, "yellow"], [75, "purple"], [25, "green"]];
    
    // scales
    var xMax = 5 * rectWidth;
    var xScale = d3.scaleLinear()
    	.domain([0, xMax])
    	.range([margin.left, width - margin.right]);
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
        return xScale(i * rectWidth)})
    	.attr('y', function(d){
        return yScale(d[0])})
    	.attr('width', xScale(rectWidth) - margin.left)
    	.attr('height', function(d){
        return height - margin.bottom - yScale(d[0])})
			.attr('fill', function(d){
        return d[1]})
    	.attr('margin', 0);
    
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

var svg = d3.select("div#mapChart").append("svg").attr("preserveAspectRatio", "xMinYMin meet").style("background-color","#c9e8fd")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content", true);
    var projection = d3.geoMercator().translate([width/2, height/2]).scale(2200).center([0,40]);
    var path = d3.geoPath().projection(projection);
        
  // load data  
var worldmap = d3.json("countries.geojson");
var cities = d3.csv("cities.csv");
   
Promise.all([worldmap, cities]).then(function(values){    
 // draw map
    svg.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","continent")
        .attr("d", path),
 // draw points
    svg.selectAll("circle")
        .data(values[1])
        .enter()
        .append("circle")
		.attr("class","circles")
        .attr("cx", function(d) {return projection([d.Longitude, d.Lattitude])[0];})
        .attr("cy", function(d) {return projection([d.Longitude, d.Lattitude])[1];})
        .attr("r", "1px"),
 // add labels
    svg.selectAll("text")
        .data(values[1])
        .enter()
        .append("text")
		.text(function(d) {
			   		return d.City;
			   })
		.attr("x", function(d) {return projection([d.Longitude, d.Lattitude])[0] + 5;})
		.attr("y", function(d) {return projection([d.Longitude, d.Lattitude])[1] + 15;})
		.attr("class","labels");
        
    }); 
   