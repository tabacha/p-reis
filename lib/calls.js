var express = require('express');
var router = express.Router();

//router.use(function timeLog(req,res, next) {
//        console.log('Time',Date.now());
//    next();
//});


router.get("/", function(req, res) {
    res.render('calls', {
        menu: 'calls',
        title: req.__('Calls'),
        user:req.user,
    });
});
router.get("/getAll", function(req, res) {
    var data={'data':[
        {
            'time':'2015-01-30 12:30',
            'duration':'12min',
            'my_number':'2004297',
            'my_device':'301',
            'direction':'incomming',
            'dialog_partner':'Sven Firma',
            'dialog_partner_ext':'+49-40-23376-135',
        },
        {
            'time':'2015-01-30 12:35',
            'duration':'15min',
            'my_number':'2004297',
            'my_device':'301',
            'direction':'incomming',
            'dialog_partner':'Sven Firma',
            'dialog_partner_ext':'+49-40-23376-135',
        },
    ]};
    res.json(data);
});


module.exports=router;