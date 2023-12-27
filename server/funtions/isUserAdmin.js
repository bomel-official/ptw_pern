const isUserAdmin = (user, roles) => {
    if (roles) {
        return roles.includes(user.role)
    }
    return (user.role === 'ADMIN' || user.role === 'SUPERADMIN')
}
module.exports = isUserAdmin