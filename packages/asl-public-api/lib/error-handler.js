module.exports = () => {

  return (error, req, res, next) => {
    res.status(error.status);
    res.json({ message: error.message });
  };

};
