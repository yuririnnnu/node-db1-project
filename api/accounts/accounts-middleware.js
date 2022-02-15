const Accounts = require('./accounts-model')
const db = require('../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  const error = {status: 400}
  const { name, budget } = req.body
  if (name === undefined || budget === undefined){
    error.message = "name and budget are required"
  } else if (typeof name !== 'string') {
    error.message = "name of account must be string"
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    error.message = "name of account must be between 3 and 100"
  } else if (typeof budget !== 'number' || isNaN(budget)) {
    error.message = "budget of account must be a number"
  } else if (budget < 0 || budget > 1000000) {
    error.message = "budget of account is too large or too small"
  }
  if (error.message) {
    next(error)
  } else {
    next()
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try{
    const exists = await db('accounts').where("name", req.body.name.trim()).first()
    if (exists) {
      next({status: 400,  message: "that name is taken" })
    } else {
      next()
    }
  } catch(e) { next(e) }
  
}

exports.checkAccountId = async (req, res, next) => {
  try{
    const account = await Accounts.getById(req.params.id)
    if (!account) {
      next({status:404, message: "account not found"})
    } else {
      res.account = account
      next()
    }
  } catch(e) {
    next(e)
  }
}
