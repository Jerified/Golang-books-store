export type Book = {
    base64: string;
    id: string,
    price: number,
    title: string,
    subtitle: string,
    authors: string[],
    publisher: string,
    publishedDate: string,
    pageCount: number,
    language: string,
    description: string,
    previewLink: string,
    image: Image,
    category: string,
    infoLink: string,
    samplePDFLink?: string
}

type Image = {
    smallThumbnail: string,
    thumbnail: string;
}