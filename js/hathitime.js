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
  for (var i=0; i < response.facet_counts.facet_fields.publishDate.length; i=i+2) {
    var year = response.facet_counts.facet_fields.publishDate[i];
    var count = response.facet_counts.facet_fields.publishDate[i+1];
    $("#results").append(Mustache.render(template, {
      year: year,
      count: count
    }));
  }
}
