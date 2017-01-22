console.log("Yelp,I'm Hungry is starting ...");

var Yelp = require('yelp-api-v3');

var yelp = new Yelp({
  app_id: 'F-WmYeZdZ_nsR0rjGA5qGA',
  app_secret: '5GXOiYpo7sewGFDkIhegUnheT24xcwyZlZ3Un3Po47WWDJxS9febJfqlSyKyqoOK'
});
/*
var yelp = new Yelp({
  consumer_key: '4CtmyDa87cf6VvWLt5GACQ',
  consumer_secret: 'WdW5HdhV7zmakCwuTARGbn_3ptw',
  token: 'nlBavdBgX-gmAKSK94kr-PyLTB4M9ltg',
  token_secret: 'SI4RCC2EFEyp4dMDI2nHKtXS9JU',
});
*/

yelp.search({
  term: 'chinese,food',
  category_filter:'food' ,
  location: 'Toronto',
  limit:'5',
  sort:'2',
  is_closed:'false',
  price:'2'
})
.then(function (data) {
  var apiReturn = JSON.parse(data);
  for (var i = 0; i < 4;++i){
    console.log(apiReturn.businesses[i].name);
    console.log(JSON.stringify(apiReturn.businesses[i].location.display_address[0]));
    console.log(JSON.stringify(apiReturn.businesses[i].location.display_address[1]));
    console.log(JSON.stringify(apiReturn.businesses[i].location.display_address[2]));
    console.log(apiReturn.businesses[i].rating );
    console.log(apiReturn.businesses[i].review_count);
    console.log(apiReturn.businesses[i].price);
    console.log(apiReturn.businesses[i].url);
    console.log("==========================");
  }
})
.catch(function (err) {
  console.error(err);
});
