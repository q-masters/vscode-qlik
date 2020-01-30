declare module '*.html';

declare module '*.css' {
    const content: string;
    export default content;
}
