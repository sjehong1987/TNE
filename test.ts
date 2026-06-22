import { GalleryService } from './services/galleryService';

const item = {
  image: "url",
  images: ["url1", "url2"],
  title: "title",
  location: "loc",
  description: "desc",
  author: "auth",
  date: "date",
  tags: ["tag"]
};

const { images, ...payloadToInsert } = item;
console.log(payloadToInsert);
