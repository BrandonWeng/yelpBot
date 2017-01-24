console.log("Yelp,I'm Hungry is starting ...");

// var token = 'EAAaGpOO0SCEBANtXJrv2eBDSJqtrHajmUwPnwY50OQkU2SRlOWqJZBU66cd8ZBPyjgE5jmg1odA7ueHh4iWkuBcnj8njXAUkLGAK3oUgxliPjMgAZCii60Mp8idpUlYoREx3dG5Cw66HA70bLo2htbOLck1DRav1Gp6L4zWigZDZD';

var Yelp = require('yelp-api-v3');
var yelp = new Yelp(require('./config'));

function yelpSearched(term,location,price,makeCards){

  var yelpSearch = {
    term: term,
    category_filter:'food' ,
    location: location,
    limit:'5',
    sort:'2',
    is_closed:'false',
    price: price,
    open_now:'true'
  };

  yelp.search(yelpSearch,printYelp);

  function printYelp(err,data){
    if (err) return console.error("Yelp, Something went wrong! :" + err);
    makeCards(JSON.parse(data));
  }
}
