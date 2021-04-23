export class MimeTypeUtil {

    private static readonly mimeTypeLookup = [
        'image/apng:apng',
        'image/bmp:bmp',
        'image/gif:gif',
        'image/x-icon:ico',
        'image/jpeg:jpg',
        'image/png:png',
        'image/svg+xml:svg',
        'image/tiff:tif',
        'image/webp:webp'
    ];

    static getExtension(mimeType: string): string {
        const mimetypeItem = this.mimeTypeLookup.find(val => val.startsWith(mimeType));

        if (mimetypeItem) {
            return mimetypeItem.split(':')[1]
        } else {
            return null;
        }
    }

}