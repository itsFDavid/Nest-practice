
export const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: Function
) => {
    if(!file) return callback(new Error('No file provided'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if(!validExtensions.includes(fileExtension)) {
        return callback(new Error('Invalid file type'), false);
    }

    callback(null, true);
}