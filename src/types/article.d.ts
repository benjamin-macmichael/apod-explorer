export type Article = {
    url: string;
    urlToImage: string | null;
    title: string;
    description: string;
  }

export type NewsApiResponse = {
  articles: Article[];
}