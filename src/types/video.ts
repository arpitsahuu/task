
export interface Option {
    title: string;
    id: string
}
export interface Video {
    id: string;
    title: string;
    src: string;
    thumbnail: string;
    options?:Option[];
}
  
  