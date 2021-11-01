const Account = require('./accounts-model')
const db= require('../../data/db-config')

// checkAccountPayload returns a status 400 with if req.body is invalid:

// If either name or budget are undefined, return { message: "name and budget are required" }
// If name is not a string, return { message: "name of account must be a string" }
// If the trimmed name is shorter than 3 or longer than 100, return { message: "name of account must be between 3 and 100" }
// If budget is not a number, return { message: "budget of account must be a number" }
// If budget is a negative number or over one million, return { message: "budget of account is too large or too small" }
exports.checkAccountPayload = (req, res, next) => {
  const error = {status: 400}
  const {name, budget} = req.body
  if(name ===undefined || budget ===undefined){
    error.message =   "name and budget are required"
  } else if(typeof name !== 'string'){
    error.message = "name of account must be a string" 
  } else if(name.trim().length <3 || name.trim().length >100){
    error.message = "name of account must be between 3 and 100" 
  } else if( typeof budget !=='number'|| isNaN(budget)){
    error.message = "budget of account must be a number"
  } else if( budget <0 || budget > 1000000){
    error.message = "budget of account is too large or too small"
  }
  if(error.message){
    next(error)
  } else {
    next()
  }
}
//checkAccountNameUnique returns a status 400 with a { message: "that name is taken" } if the trimmed req.body.name already exists in the database
exports.checkAccountNameUnique = async (req, res, next) => {
  try{
    const existing = await db('accounts').where('name', req.body.name.trim()).first()
    if(existing){
      next({status: 400, message: "that name is taken" })
    }else {
      next()
    }
  }catch (err){
    next(err)
  }
}
//checkAccountId returns a status 404 with a { message: "account not found" } if req.params.id does not exist in the database
exports.checkAccountId = async (req, res, next) => {
  // DO YOUR MAGIC
  try{
    const account = await Account.getById(req.params.id)
    if(!account){
      next({status: 404, message: "account not found" })
    } else {
      req.account= account
      next()
    }
  }catch( err){
    next(err)
  }
}
