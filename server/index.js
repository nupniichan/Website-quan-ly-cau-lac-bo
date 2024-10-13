
const express = require('express')
const { connect } = require('mongoose')

const app = express()
const connectDB = require('./server.js')

const PORT = 3000;

connectDB()

app.listen(3000, () => {
    console.log('app is currently running')
})

app.get('/tshirt', (req, res) => {

    res.status(200).send({
        thepinkcat :'hello'
    })

})

app.post('/tshirt/:id', (req,res) => {
    const {id} = req.params;
    const {logo} = req.logo;

    if (!logo) {
        res.status(418).send({Message: 'we need a logo'})
    }

    res.send({
        tshirt: `cai ao nay with your ${logo} and id of ${id}`
    })
})