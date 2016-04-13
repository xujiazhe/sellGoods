var express = require('express');
var router = express.Router();
var Order = require('../models/orders');

/* . */
router.get('/', function(req, res, next) {
  Order.getAll(function(err, orders){
        if( err ){
            res.render('error', err);
        }else {
            // orders.reverse();
            for(var i = 0;i<orders.length;i++){
                orders[i].date2 = orders[i].date.split(',')[0];
                if( i === 0 || orders[i].date2 != orders[i-1].date2){
                    orders[i].date_split = orders[i].date2;
                    
                }
            }
            res.render('order_list', {'orders':orders});
        }
    })
});

module.exports = router;
