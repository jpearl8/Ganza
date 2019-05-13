const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');


const { body, validationResult } = require('express-validator/check');

const router = express.Router();
const Registration = mongoose.model('Registration');
const Fashion = mongoose.model('Fashion');

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
  });
//username: ganzamem, password: gpeople68
//username: fboard8, password: change88
const advanced = auth.basic({
    file: path.join(__dirname, '../fashion.htpasswd'),
})

router.post('/1', 
    [
        body('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        body('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            console.log(req.body);
            const registration = new Registration(req.body);
            registration.save()
                .then(() => { res.send('Thank you for your registration!'); })
                .catch(() => { res.send('Sorry! Something went wrong'); })
        } else {
            console.log(req.body);
            res.render('form', {
            title: 'Registration form',
            errors: errors.array(),
            data: req.body,
        });
    }    
});
   
router.post('/fashion/:test?', 
    [
        body('brand')
        .isLength({ min: 1 })
        .withMessage('brand issue'),
        body('item')
        .isLength({ min: 1 })
        .withMessage('item issue'),
        body('song')
        .toInt()
        //.isNumeric()
        .withMessage('song issue'),
        body('Scene')
        .toInt()
        //.isNumeric()
        .withMessage('scene issue')
    ], auth.connect(advanced),
    (req, res) => {
        var n1 = req.params.test;
        if (n1 == undefined) {
            const errors = validationResult(req);
            console.log(req.body);
            if (errors.isEmpty()) {
                console.log(req.body);
                reqq = {};
                for(var key in req.body){
                    if (key != "_id"){
                        reqq[key] = req.body[key];
                    }
                }
                const fashion = new Fashion(reqq);
                fashion.save()
                    .then(() => { res.redirect('fashion'); })
                    .catch(() => { res.send('Sorry! Something went wrong'); })
            } else {
                console.log(req.body);
                res.render('fashion', {
                    title: 'Fashion form',
                    errors: errors.array(),
                    data: req.body,
                });
            }
        } else {
            console.log("TESTY");
            console.log(req.body);
            console.log((req.body._id).toString());
            reqq = {};
            for(var key in req.body){
                if (key != "_id"){
                    reqq[key] = req.body[key];
                }
            }
            //const fashion = new Fashion(reqq);
            console.log(reqq);
            console.log("have things gone wrong?");
            var ii = "ObjectId(\"" + req.body._id.toString() + "\")";
            console.log(ii);
            Fashion.update({ "_id": ii}, {$set: {reqq}})   
                .then(() => { res.redirect('fashion'); })
                .catch(() => { res.send('Sorry! Something went wrong'); })
           // res.render('fashion', { title: 'Fashion', fashions });
                // .then(() => { res.redirect('fashion'); })
                // .catch(() => { res.send('Sorry! Something went wrong'); })
        }
});

router.get('/fashion', auth.connect(advanced), (req, res) => {
    Fashion.find()
    .then((fashions) => {
      res.render('fashion', { title: 'Fashion', fashions });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});

router.get('/1', (req, res) => {
   res.render('form', { title: 'Registration form' });
 });


router.get('/', auth.connect(basic), (req, res) => {
    res.render('init', { title: 'Ganza fashion'});
})

// router.get('/scenes', auth.connect(basic), (req, res) => {
//     res.render('scenes', {title: 'Scenes'});
// })*/

router.get('/scenes', auth.connect(basic), (req, res) => {
    Fashion.find()
    .then((fashions) => {
      res.render('scenes', { title: 'Listing Scenes', fashions });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); }); 
}); 

router.post('/scenes', auth.connect(basic), (req, res) => {
    var s1 = req.body["scene"];
    var s2 = req.body["song"];
    console.log(s1);
    console.log(s2);
    Fashion.aggregate([
        {
          $match: {
            scene: Number(s1), 
            song: Number(s2)
          }
        }
      ])
    .then((fashions) => {
        res.render('scenes', { title: 'Listing Scenes', fashions });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
 });


router.get('/registrations', auth.connect(basic), (req, res) => {
    Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); }); 
});

router.get('/models', auth.connect(basic), (req, res) => {
    Fashion.aggregate([
        {
          $match: {
            assigned: true
          }
        }, {
          $group: {
            _id: '$model'
          }
        }
      ]
    ) 
    .then((fashions) => {
        res.render('models', { title: 'Models', fashions});
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
})

router.get('/brands', auth.connect(basic), (req, res) => {
    Fashion.aggregate([
        {
          $group: {
            _id: '$brand'
          }
        }, {
          $sort: {
            _id: 1
          }
        }
      ])
    .then((fashions) => {
        res.render('brands', { title: 'Brands', fashions});
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
})

router.get('/mspec/:name', auth.connect(basic), (req, res) => {
    var n1 = req.params.name;
    Fashion.aggregate([
        {
          '$match': {
            'model': String(n1)
          }
        }, {
          '$sort': {
            'brand': 1
          }
        }
    ])
    .then((fashions) => {
        res.render('mspec', { title: 'Model', fashions, name: String(n1)});
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
})

router.get('/bspec/:brand', auth.connect(basic), (req, res) => {
    var b1 = req.params.brand;
    Fashion.aggregate([
        {
            $match: {
                brand: String(b1)
            }
        }, {
            $sort: {
                item: 1
            }
        }
    ])
    .then((fashions) => {
        res.render('bspec', { title: 'Brand', fashions, brand: String(b1)});
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
})

module.exports = router;