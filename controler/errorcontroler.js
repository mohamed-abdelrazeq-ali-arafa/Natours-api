module.exports=(err, req, res, next) => {
    err.status_code = err.status_code || 500;
    err.status = err.status || "Erro";
    res.status(err.status_code).json({
      status: `${err.status}`,
      error: err.message,
    });
    next();
  }