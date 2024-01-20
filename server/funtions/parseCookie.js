const parseCookie = (cookies) => {
    const data = {}
    try {
        for (let cookie of cookies.split(';')) {
            const [name, value] = cookie.split('=')
            data[name.trim()] = value.trim()
        }
    } catch (e) {
        data.error = true
    }
    return data
}
module.exports = parseCookie