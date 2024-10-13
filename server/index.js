
const express = require('express')
const { connect } = require('mongoose')

const app = express()
const connectDB = require('./server.js')

const PORT = 3000;

connectDB()

app.listen(3000, () => {
    console.log('app is currently running')
})