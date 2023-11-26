const parseCookie = (cookies) => {
    const data = {}
    for (let cookie of cookies.split(';')) {
        const [name, value] = cookie.split('=')
        data[name.trim()] = value.trim()
    }
    return data
}
module.exports = parseCookie