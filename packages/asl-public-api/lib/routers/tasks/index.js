const { Router } = require('express');
const router = Router({ mergeParams: true });

const fetchTasks = () => {
  return (req, res, next) => {
    const params = {
      action: 'read',
      query: {
        data: {
          subject: req.user.profile.id
        },
        ...req.query
      }
    };

    console.log('fetch tasks params: ', params);

    return req.workflow(params)
      .then((response) => {
        res.meta = response.json.meta;
        res.response = response.json.data;
        next();
      })
      .catch(next);
  };
};

router.use('/', fetchTasks());

module.exports = router;
