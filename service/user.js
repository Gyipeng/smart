const User = require('../db/model/userModel')

const getUsers = async (obj) => {
    let users = await User.find(obj)
    return users
}

const getUserList = async (obj, pageSize, page) => {
    let users = await User.find(obj).limit(Number(pageSize)).skip(Number((page - 1) * pageSize))
    return users
}

const getUserOne = async (obj) => {
    const user = await User.findOne(obj)
    return user
}

const getUserOneByName = async (name) => {
    const user = await User.findOne({name})
    return user
}


const addUser = async (user) => {
    const newUser = await User.create(user)
    if (newUser) {
        return newUser
    }
}

const updateUser = async (email, user) => {
    const newUser = await User.updateOne({email}, user)
    return newUser

}

const checkPassword = async (obj, password) => {
    let match = false
    const user = await User.findOne(obj).exec()
    if (user) {
        match = await user.comparePassword(password, user.pass)
    }
    return {
        user,
        match
    }
}
module.exports = {
    checkPassword,
    addUser,
    getUserOneByName,
    getUserOne,
    getUsers,
    updateUser,
    getUserList
}