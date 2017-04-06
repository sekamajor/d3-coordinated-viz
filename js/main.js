//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //map frame dimensions
    var width = 960,
        height = 460;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on France
    var projection = d3.geoAlbers()
        .center([0, 44.9])
        .rotate([93.2, 0, 0])
        .parallels([10.86, 45.5])
        .scale(90000)
        .translate([width / 2, height / 2]);
    var path = d3.geoPath()
        .projection(projection);
    //use d3.queue to parallelize asynchronous data loading
    d3.queue()
        .defer(d3.csv, "data/MinneapolisNeighborhoods2.csv") //load attributes from csv
        .defer(d3.json, "data/Minnesota.topojson") //load background spatial data
        .defer(d3.json, "data/MinneapolisReprojected.topojson") //load choropleth spatial data
        .await(callback);
 
 function callback(error, csvData, minnesota, minneapolis){
        //create graticule generator
        var graticule = d3.geoGraticule()
            .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude
        //create graticule lines
        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
        //create graticule background
        var gratBackground = map.append("path")
            .datum(graticule.outline()) //bind graticule background
            .attr("class", "gratBackground") //assign class for styling
            .attr("d", path) //project graticule
    
        

        //translate minnesota TopoJSON
        var minnesota = topojson.feature(minnesota, minnesota.objects.Minnesota).features,
         minneapolisNeighborhoods = topojson.feature(minneapolis, minneapolis.objects.MinneapolisReprojected).features;
        
        var state = map.selectAll(".state")
            .data(minnesota)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("d", path);


        var neighborhoods = map.selectAll(".neighborhoods")
        .data(minneapolisNeighborhoods)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "neighborhoods" + d.properties.adm1_code;
            })
            .attr("d", path);
    };


};
