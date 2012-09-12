#!/usr/bin/env python

"""
This script fetches the total counts by year and persists them to js/all.js 
Since this results in a query for every year, it's nice about waiting a 
second between requests.
"""

import time
import json
import requests

counts = {}
url = 'http://chinkapin.pti.indiana.edu:9994/solr/select/?qt=sharding&wt=json&q=publishDate:%s'

for year in range(1600, 2013):
    r = requests.get(url % year, headers={"user-agent": "hathitime: https://github.com/edsu/hathitime"})
    j = json.loads(r.content)
    counts[str(year)] = j["response"]["numFound"]
    print year
    time.sleep(1)

open("js/all.js", "w").write("allCounts = " + json.dumps(counts, indent=2) + ";")
