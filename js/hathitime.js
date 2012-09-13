function init() {
  $('input[type="submit"]').click(search);
  if (location.hash) {
    var q = location.hash.slice(1);
    $('input[name="q"]').val(q);
    search();
  }
}

function search() {
  $("#results").empty();
  var q = encodeURIComponent($('input[name="q"]').val());
  var url = "http://chinkapin.pti.indiana.edu:9994/solr/select/?qt=sharding&facet=true&facet.field=publishDate&wt=json&facet.sort=index&facet.limit=2000&q=+ocr:%22" + q + "%22";
  $.ajax({url: url, dataType: "jsonp", success: drawGraph, jsonp: "json.wrf"});
  location.hash = "#" + q;
}

function drawGraph(response) {
  // collect data from the solr response
  var counts = [];
  var percents = [];
  var result = response.facet_counts.facet_fields.publishDate;
  for (var i = 0; i < result.length; i = i + 2) {
    var year = result[i];
    var count = result[i + 1];
    if (year > 2012 || year <= 1600) continue;
    var percent = parseInt(count / allCounts[year] * 100);
    counts.push([parseInt(year), parseInt(count)]);
    percents.push([parseInt(year), percent]);
  }

  // the word/phrase that was searched for
  var q = $('input[name="q"]').val();

  // add the percentage graph
  var id = "percents-" + $(".graph").length + 1;
  var div = $("#graphs").prepend('<div title="' + q + '" id="' + id + '" class="graph"></div>');
  var graph = document.getElementById(id);
  var opts = {
    width: 800, 
    height: 300,
    valueRange: [0, 101],
    pointClickCallback: searchCatalog,
    title: 'Percentage of books that mention <em>' + q + '</em>'
  };
  var g = new Dygraph(graph, percents, opts);

  // add the counts graph
  var id = "counts-" + $(".graph").length + 1;
  var div = $("#graphs").prepend('<div title="' + q + '" id="' + id + '" class="graph"></div>');
  var graph = document.getElementById(id);
  var opts = {
    width: 800, 
    height: 300,
    pointClickCallback: searchCatalog,
    title: 'Number of books that mention <em>' + q + '</em>'
  };
  var g = new Dygraph(graph, counts, opts);
}

function searchCatalog(e, point) {
  var year = point.xval;
  var q = $(e.currentTarget).parent().parent().attr("title");
  var url = "http://babel.hathitrust.org/cgi/ls?a=srchls&anyall1=phrase&q1=" + q + "&field1=ocr&op3=AND&yop=in&pdate=" + year;
  window.open(url, "_blank");
}
