const express = require('express');
const common = require('../middleware/common');
const except = require('../middleware/errors');

const accountRouter = require('../routes/account.route');
const groupRouter = require('../routes/group.route');
const adminRouter = require('../routes/admin.route');
const cusrepRouter = require('../routes/cusrep.route');
const workoutRouter = require('../routes/workout.route');
const challengeRouter = require('../routes/challenge.route');

module.exports = () => {
  const app = common(express());

  app.use('/account', accountRouter);
  app.use('/group', groupRouter);
  app.use('/admin', adminRouter);
  app.use('/cusrep', cusrepRouter);
  app.use('/workout', workoutRouter);
  app.use('/challenge', challengeRouter);

  return except(app);
};
