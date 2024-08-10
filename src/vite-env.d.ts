/// <reference types="vite/client" />

declare module 'quill' {
    export default any;
}

declare module 'quill-image-uploader' {
    export default any;
}

declare interface Class<T> {
    new(...args): T
}