// middleware untuk merubah URL sebelum mencari data di database
const urlTransformMiddleware = (req, res, next) => {
  req.params.judul = req.params.judul.replace(/%2/g, "-");
  next();
};

module.exports = {
  urlTransformMiddleware,
};
