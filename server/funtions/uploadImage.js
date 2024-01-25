const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const sharp = require("sharp");
const path = require("path");

const uploadImage = async (image, width = 872, height = 594) => {
    if (image) {
        let filename = uuid.v4() + '.jpg'
        const allowedFiletypes = ['image/jpeg', 'image/png']
        if (!allowedFiletypes.find(type => type === image.mimetype)) {
            throw new Error('Недопустимый формат изображения, загружайте PNG и JPG файлы')
        }
        await sharp(image.data).resize({
            width: width,
            height: height,
            fit: 'cover',
            background: {r: 255, g: 255, b: 255, alpha: 1}
        }).toFormat('jpeg').toFile(path.resolve(__dirname, '..', 'static', filename))
        return filename
    }
}

module.exports = uploadImage