const express = require('express')
const bodyParser = require('body-parser')

const dishRouter = express.Router()

const Dishes = require('../models/dishes')

dishRouter.use(bodyParser.json())

dishRouter.route('/')
  .get((req, res, next) => {
    Dishes.find({}).then(dishes => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(dishes)
    }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(dish => {
        console.log('Dish created: ', dish)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, e => next(e))
      .catch(e => next(e))
  })
  .put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then(resp => {
        console.log('Dish deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })
dishRouter.route('/:dishId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
      }, {
        new: true
      }
    )
      .then(dish => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, e => next(e))
      .catch(e => next(e))
  })
  .delete((req, res) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(resp => {
        console.log('Dish deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })

dishRouter.route('/:dishId/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if(dish === null){
          res.statusCode = 404
          let err = new Error(`Dish ${req.params.dishId} not found!`)
          return next(err)
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish.comments)
      }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if(dish === null){
          res.statusCode = 404
          let err = new Error(`Dish ${req.params.dishId} not found!`)
          return next(err)
        }
        dish.comments.push(req.body)
        dish.save()
          .then(dish=>{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          })
      }, e => next(e))
      .catch(e => next(e))
  })
  .put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments')
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if(dish === null){
          res.statusCode = 404
          let err = new Error(`Dish ${req.params.dishId} not found!`)
          return next(err)
        }
        for(let i = dish.comments.length - 1; i >= 0 ; i--){
          dish.comments.id(dish.comments[i]._id).remove()
        }
        dish.save()
          .then(dish=>{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, e => next(e))
      }, e => next(e))
      .catch(e => next(e))
  })
dishRouter.route('/:dishId/comments/:commentId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if(dish === null || dish.comments.id(req.params.commentId) === null){
          res.statusCode = 404
          let err = ''
          if(dish === null){
            err = new Error(`Dish ${req.params.dishId} not found!`)
          }else{
            err = new Error(`Comment ${req.params.commentId} not found!`)
          }
          return next(err)
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish.comments.id(req.params.commentId))
      }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`)
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if(dish === null || dish.comments.id(req.params.commentId) === null){
          res.statusCode = 404
          let err = ''
          if(dish === null){
            err = new Error(`Dish ${req.params.dishId} not found!`)
          }else{
            err = new Error(`Comment ${req.params.commentId} not found!`)
          }
          return next(err)
        }
        if (req.body.rating){
          dish.comments.id(req.params.commentId).rating = req.body.rating
        }
        if (req.body.comment){
          dish.comments.id(req.params.commentId).comment = req.body.comment
        }
        dish.save()
          .then(dish=>{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, e => next(e))
      }, e => next(e))
      .catch(e => next(e))
  })
  .delete((req, res) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        if(dish === null || dish.comments.id(req.params.commentId) === null){
          res.statusCode = 404
          let err = ''
          if(dish === null){
            err = new Error(`Dish ${req.params.dishId} not found!`)
          }else{
            err = new Error(`Comment ${req.params.commentId} not found!`)
          }
          return next(err)
        }
        dish.comments.id(req.params.commentId).remove()
        dish.save()
          .then(dish=>{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
          }, e => next(e))
      }, e => next(e))
      .catch(e => next(e))
  })

module.exports = dishRouter
