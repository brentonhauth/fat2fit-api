/**
 * @typedef {import('express').RequestHandler} ExpressRequestHandler
 */

/** */
module.exports = {

  /** @type {ExpressRequestHandler} */
  login(req, res, next) {
    const { email, password } = req.body;
    User.findByEmailAndPassword(email, password).then(user => {
      if (!user) {
        res.json({ msg: 'login failed' });
      } else {
        let token = user.generateToken();
        const payload = ok({ user, token });
        res.json(payload);
      }
    }).catch(next);
  },

  /** @type {ExpressRequestHandler} */
  signup(req, res, next) {
    req.body.role = UserRole.END_USER; // prevents user from injecting admin role
    let user = new User(req.body);
    let password = new Password(req.body);
    user.save((err, doc) => {
      if (err) {
        return next(err);
      } else {
        password.save((err,result) => {
          if (err) {
            console.log(err);
            return next(err);
          } else {
            res.json( ok(result, "Signed up") );
          }
        });
      }
    });
  },

  /** @type {ExpressRequestHandler} */
  getQuestions(req, res, next) {
    // Handle recieveing user questions
    const email = req.query.email;
    Password.findOne({ email }, function(err, result) {
      if (err) {
        return next(err);
      } else if (!result) {
        return next(new Error('No user found'));
      } else {
        const questions = {
          question1: result.question1,
          question2: result.question2
        };
        res.json(ok(questions));
      }
    });
  },

  /** @type {ExpressRequestHandler} */
  passreset(req, res, next) {
    var email = req.user.e; // just 'e'
    var password = req.body.password;
    User.findOne({email},function(err,user){
      if (err) {
        return next(err);
      } else {
        user.password=password;
        user.save((err, doc) => {
          if (err) next(err);
          else res.json(ok(doc, "Password Update Complete"));
        });
      }
    });
  }
};
