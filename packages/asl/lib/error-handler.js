module.exports = () => {
  return (error, req, res, next) => {
    console.log(error);
    if (error.status) {
      res.status(error.status);
    }
    res.render('error', { error });
  };
};
