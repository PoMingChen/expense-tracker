module.exports = (req, res, next) => {

  const successMessages = req.flash('success');  // Fetch success messages
  const errorMessages = req.flash('error');      // Fetch error messages

  // Store the messages in res.locals so they are accessible in your templates
  res.locals.success_msg = successMessages;
  res.locals.error_msg = errorMessages;

  next()
}