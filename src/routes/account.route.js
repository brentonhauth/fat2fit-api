const router = require('express').Router();
const controller = require('../controllers/account.controller');
const auth = require('../middleware/auth');

router.get('/info', auth(), controller.info);

router.post('/fitdata', auth(), controller.sendFitData);

router.post('/login', controller.login);

router.post('/signup', controller.signup);

router.route('/questions')
  .get(controller.getQuestions)
  .post(controller.answerQuestions);
//

router.post('/passreset', auth({action: 'passreset'}), controller.passreset);


module.exports = router;
