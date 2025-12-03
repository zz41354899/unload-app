import * as prismic from '@prismicio/client';

const repoName = 'unloadjournal';
const endpoint = prismic.getRepositoryEndpoint(repoName);

export const prismicClient = prismic.createClient(endpoint, {});

export type PrismicBlogPostData = {
  title?: prismic.RichTextField;
  excerpt?: prismic.RichTextField;
  content?: prismic.RichTextField;
  cover_image?: {
    url?: string;
    alt?: string | null;
  } | null;
  published_at?: string | null;
};

export type PrismicBlogPost = prismic.PrismicDocument<PrismicBlogPostData>;
