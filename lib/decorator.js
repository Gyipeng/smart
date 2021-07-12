const express = require('express')
const {resolve} = require('path')
const glob = require('glob')
const R = require('ramda');
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const {Forbbiden,AuthFailed} = require('./httpException')

const isArray = arr => Array.isArray(arr) ? arr : [arr]

class Route {
    constructor(app, apiPath) {
        this.app = app;
        this.apiPath = apiPath;
        this.router = express.Router();
    }

    init() {
        glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)
        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller)
            let prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path
            this.router[conf.method](routerPath, ...controllers)
        }
        this.app.use(this.router)
    }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path);
    routerMap.set({
        target,
        ...conf
    }, target[key])
}

const controller = path => target => (target.prototype[symbolPrefix] = path)


const get = path => router({
    method: 'get',
    path
})

const post = path => router({
    method: 'post',
    path
})

const put = path => router({
    method: 'put',
    path
})

const del = path => router({
    method: 'del',
    path
})

const all = path => router({
    method: 'all',
    path
})

const convert = middleware => (target, key, descriptor) => {
    target[key] = R.compose(
        R.concat(
            isArray(middleware)
        ),
        isArray
    )(target[key])
    return descriptor
}

/**
 * 登陆状态
 */
const authUser = convert(async (req, res, next) => {
    if (!req.session.user) {
        let status = 403
        res.json(status,new Forbbiden())
        return
    }
    await next()
})


/**
 * 权限校验
 * @param roleExp
 * @returns {*}
 */
const adminRole = roleExp => convert(async (req, res, next) => {
    const {user: {role}} = req.session
    if (role !== roleExp) {
        let status = 401
        res.json(status,new AuthFailed())
        return
    }
    await next()
})

/**
 * 参数合法性校验
 * @param rules
 * @returns {*}
 */
const required = rules => convert(async (req, res, next) => {
    let errors = []
    const checkRules = R.forEachObjIndexed(
        (value, key) => {
            errors = R.filter(i => !R.has(i, req[key]))(value)
        }
    )
    checkRules(rules)
    if (errors.length) {
        res.json({code:0, msg:`${errors.join(',')} is required`})
        return
    }
    await next()
})

module.exports = {
    Route,
    controller,
    get,
    adminRole,
    post,
    put,
    required,
    authUser

}