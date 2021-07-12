const register = require('@babel/register')
const polyfill = require('babel-polyfill')
const express = require('express')
const {connect} = require('./db/contnect')
const app = express()
const path = require('path')
const R = require('ramda')

// 启动逻辑
async function start() {
    const MIDDLEWARES = ['exception', 'common', 'router'];
    const useMiddlewares = (app) => {
        R.map(
            R.compose(
                R.forEachObjIndexed(
                    initWith => initWith(app)
                ),
                require,
                name => path.join(__dirname, `./middlewares/${name}`)
            )
        )(MIDDLEWARES)
    }
    await connect()
// 静态目录指向
    app.use('/public', express.static(path.join(__dirname, './static')))
   await useMiddlewares(app)
    app.listen(3200, () => {
        console.log('ok')
    })
}

start()