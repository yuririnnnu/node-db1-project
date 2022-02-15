const router = require('express').Router()
const Accounts = require('./accounts-model')
const { checkAccountId,
        checkAccountNameUnique,
        checkAccountPayload
      } = require('./accounts-middleware')

router.get('/', (req, res, next) => {
  Accounts.getAll()
  .then(a => {
    res.json(a)
  })
  .catch(e => next(e))
})

router.get('/:id', checkAccountId, (req, res, next) => {
  Accounts.getById(req.params.id)
  .then(a => {
    res.json(a)
  })
  .catch(e => next(e))
})

router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try{
    const newAccount = await Accounts.create({
      name: req.body.name.trim(),
      budget: req.body.budget
    })
    res.status(201).json(newAccount)
  } catch(e) {
    next(e)
  }
  
  Accounts.create(req.body)
  .then(a => {
    res.json(a)
  })
  .catch(e => next(e))
})

router.put('/:id', checkAccountPayload, checkAccountId, async (req, res, next) => {
  try {
    const account = await Accounts.updateById(req.params.id, req.body)
    res.json(account)
  }
  catch (e) { 
    next(e) 
  }  
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  Accounts.deleteById(req.params.id)
  .then(a => {
    res.json(a)
  })
  .catch(e => next(e))
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
  })
})

module.exports = router;
