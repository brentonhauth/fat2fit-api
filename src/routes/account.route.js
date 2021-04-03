const router = require('express').Router();
const controller = require('../controllers/account.controller');


router.post('/login', controller.login);

router.post('/signup', controller.signup);

router.route('/questions')
  .get(controller.getQuestions)
  .post();
//

router.post('/passreset', controller.passreset);


module.exports = router;
