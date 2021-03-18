const { page } = require('@asl/service/ui');
const bodyParser = require('body-parser');
const { relatedTasks } = require('@asl/pages/pages/common/routers');

const roles = ['asruAdmin', 'asruSupport', 'asruLicensing', 'asruInspector', 'asruRops'];

module.exports = () => {
  const app = page({ root: __dirname });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    req.breadcrumb('profile.read');
    res.locals.static.roles = roles;
    res.locals.static.canAdmin = req.user.profile.asruAdmin && req.profileId !== req.user.profile.id;
    res.locals.static.asruUser = req.user.profile.asruUser;
    next();
  });

  app.get('/', (req, res, next) => {
    return req.api(`/profile/${req.profileId}`)
      .then(({ json: { data } }) => {
        res.locals.model = data;
        res.locals.static.profile = data;
        res.locals.pageTitle = `${data.firstName} ${data.lastName}`;
      })
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    let data;
    if (req.body.roles !== undefined) {
      data = roles.reduce((map, role) => {
        return { ...map, [role]: req.body.roles.includes(role) };
      }, {});
    } else if (req.body.asruUser) {
      data = {
        asruUser: req.body.asruUser === 'true'
      };
    }
    return req.api(`/profile/${req.profileId}`, { method: 'PUT', json: { data } })
      .then(() => {
        req.notification({ key: 'success' });
        res.redirect(req.originalUrl);
      })
      .catch(next);

  });

  app.get('/', relatedTasks(req => {
    return {
      model: 'profile-touched',
      modelId: req.profileId
    };
  }));

  return app;
};
