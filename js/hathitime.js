function init() {
  $('input[type="submit"]').click(search);
}

function search() {
  $("#results").empty();
  var q = encodeURIComponent($('input[name="q"]').val());
  var url = "http://chinkapin.pti.indiana.edu:9994/solr/select/?qt=sharding&facet=true&facet.field=publishDate&wt=json&facet.sort=index&facet.limit=2000&q=ocr:" + q;
  $.ajax({url: url, dataType: "jsonp", success: drawGraph, jsonp: "json.wrf"});
}

function printResults(response) {
  var template = $("#result-template").html();
  var result = response.facet_counts.facet_fields.publishDate;
  for (var i=0; i < result.length; i=i+2) {
    var year = result[i];
    var count = result[i+1];
    if (year > 2012 || year <= 1600) continue;
    $("#results").append(Mustache.render(template, {
      year: year,
      count: count
    }));
  }
  drawGraph();
}

function drawGraph(response) {
  // collect data from the solr response
  var data = [];
  var result = response.facet_counts.facet_fields.publishDate;
  for (var i=0; i < result.length; i=i+2) {
    var year = result[i];
    var count = result[i+1];
    if (year > 2012 || year <= 1600) continue;
    data.push([parseInt(year), parseInt(count)]);
  }

  // draw the graph, but jump through a few hoops to allow old
  // graphs to be pushed down
  var q = $('input[name="q"]').val();
  var opts = {
    title: '"' + $('input[name="q"]').val() + '"',
    width: 800, 
    height: 300
  };

  var id = "graph-" + $(".graph").length + 1;
  $("#graphs").prepend('<div id="' + id + '" class="graph"></div>');
  var graph = document.getElementById(id);
  var g = new Dygraph(graph, data, opts);
}
