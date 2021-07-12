const {Route} = require('../lib/decorator')
const {resolve} = require('path')

exports.router = app => {
    const apiPath = resolve(__dirname, '../router')
    const router = new Route(app, apiPath)
    router.init()
}