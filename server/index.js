
const express = require('express')
const { connect } = require('mongoose')

const app = express()
const connectDB = require('./db.js')

connectDB()

app.listen(3000, () => {
    console.log('app is currently running')
})