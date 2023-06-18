module.exports = function (req, res, next) {
  if (req.params.id) req.body.filter = { category: req.params.id }
  if(req.params.productId)req.body.filter = { product: req.params.productId }
  next()
}


