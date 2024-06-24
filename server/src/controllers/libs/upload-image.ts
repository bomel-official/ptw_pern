import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
import { UploadImageOptions } from "../types";
import { Image } from "../types/upload-image-options";

export async function uploadImage( image: Image, options?: UploadImageOptions ) {
    const width = options?.width ?? 872;
    const height = options?.height ?? 594;
    const fit = options?.fit ?? "cover";
    if ( image && !Array.isArray( image ) ) {
        const filename = uuidv4() + ".jpg";
        const allowedFiletypes = [ "image/jpeg", "image/png" ];
        if ( !allowedFiletypes.find( type => type === image.mimetype ) ) {
            throw new Error(
                "Недопустимый формат изображения, загружайте PNG и JPG файлы" );
        }
        await sharp( image.data ).resize( {
            width, height, fit,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
        } ).toFormat( "jpeg" )
            .toFile( path.resolve( __dirname, "..", "..", "..", "static", filename ) );
        return filename;
    }
}
