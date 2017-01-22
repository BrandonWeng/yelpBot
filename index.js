console.log("Yelp,I'm Hungry is starting ...");

// NPM - YELP
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: '4CtmyDa87cf6VvWLt5GACQ',
  consumer_secret: 'WdW5HdhV7zmakCwuTARGbn_3ptw',
  token: 'nlBavdBgX-gmAKSK94kr-PyLTB4M9ltg',
  token_secret: 'SI4RCC2EFEyp4dMDI2nHKtXS9JU',
});

yelp.search({ term: 'food', location: 'Montreal', limit:'1' })
.then(function (data) {
  console.log(data);
})
.catch(function (err) {
  console.error(err);
});
