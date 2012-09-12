function init() {
  $('input[type="submit"]').click(search);
}

function search() {
  $("#results").empty();
  var q = encodeURIComponent($('input[name="q"]').val());
  var url = "http://chinkapin.pti.indiana.edu:9994/solr/select/?qt=sharding&facet=true&facet.field=publishDate&wt=json&facet.sort=index&facet.limit=2000&q=ocr:" + q;
  $("#results").append("<tr><th>Year</th><th>Count</th></tr>");
  $.ajax({url: url, dataType: "jsonp", success: printResults, jsonp: "json.wrf"});
}

function printResults(response) {
  var template = $("#result-template").html();
  var result = response.facet_counts.facet_fields.publishDate;
  for (var i=0; i < result.length; i=i+2) {
    var year = result[i];
    var count = result[i+1];
    if (year > 2012 || year <= 1000) continue;
    $("#results").append(Mustache.render(template, {
      year: year,
      count: count
    }));
  }
}
