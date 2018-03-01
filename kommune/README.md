curl 'http://data.ssb.no/api/klass/v1/classifications' -i -H 'Accept: application/json' >ssb_classifications

curl 'http://data.ssb.no/api/klass/v1/classifications/search?query=kommuner' -i -H 'Accept: application/json' >kommuner.json


curl 'http://data.ssb.no/api/klass/v1/classifications/131/codes?from=2014-01-01&to=2015-01-01' -i -H 'Accept: application/json; charset=UTF-8'
