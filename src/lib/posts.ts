import type { Post, PostMetadata } from '@/types/blog';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

// Re-export para manter compatibilidade
export type { Post, PostMetadata };

const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * Retorna a lista de arquivos .mdx no diretório de posts
 * @returns Array com nomes dos arquivos de posts
 */
function getPostFiles(): string[] {
  try {
    const fd = fs.openSync(postsDirectory, 'r');
    fs.closeSync(fd);
  } catch {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));
}

/**
 * Faz o parsing de um arquivo de post MDX
 * @param filename - Nome do arquivo a ser parseado
 * @returns Objeto Post com metadados e conteúdo
 */
function parsePostFile(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const { title, description, date, author, category, tags, image, videoUrl } =
    data;

  return {
    slug,
    title: typeof title === 'string' ? title : '',
    description: typeof description === 'string' ? description : '',
    date: typeof date === 'string' ? date : '',
    author: typeof author === 'string' ? author : 'Black Diaz',
    category: typeof category === 'string' ? category : 'Geral',
    tags: Array.isArray(tags)
      ? tags.filter((t): t is string => typeof t === 'string')
      : [],
    image: typeof image === 'string' ? image : undefined,
    videoUrl: typeof videoUrl === 'string' ? videoUrl : undefined,
    published: data['published'] !== false,
    content,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Retorna todos os posts publicados, ordenados por data (mais recentes primeiro)
 * @returns Array de metadados dos posts
 */
export function getAllPosts(): PostMetadata[] {
  const files = getPostFiles();
  const posts = files
    .map((filename) => parsePostFile(filename))
    .filter((post) => post.published === true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts.map(({ ...metadata }) => metadata);
}

/**
 * Busca um post específico pelo slug
 * @param slug - Identificador único do post (nome do arquivo sem extensão)
 * @returns Post completo com conteúdo, ou null se não encontrado
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const filename = `${slug}.mdx`;
    const post = parsePostFile(filename);
    return post.published === true ? post : null;
  } catch {
    return null;
  }
}

/**
 * Retorna o conteúdo completo de um post (alias para getPostBySlug)
 * @param slug - Identificador único do post
 * @returns Post completo com conteúdo, ou null se não encontrado
 * @deprecated Use getPostBySlug diretamente
 */
export function getPostContent(slug: string): Post | null {
  return getPostBySlug(slug);
}

/**
 * Filtra posts por categoria
 * @param category - Nome da categoria
 * @returns Array de posts da categoria especificada
 */
export function getPostsByCategory(category: string): PostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

/**
 * Filtra posts por tag
 * @param tag - Nome da tag
 * @returns Array de posts que contêm a tag especificada
 */
export function getPostsByTag(tag: string): PostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * Retorna lista única de todas as categorias usadas nos posts
 * @returns Array de categorias em ordem alfabética
 */
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = new Set(allPosts.map((post) => post.category));
  return Array.from(categories).sort();
}

/**
 * Retorna lista única de todas as tags usadas nos posts
 * @returns Array de tags em ordem alfabética
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set(allPosts.flatMap((post) => post.tags));
  return Array.from(tags).sort();
}

/**
 * Calcula o tempo estimado de leitura baseado na contagem de palavras
 * @param content - Conteúdo do post em texto
 * @returns Texto formatado com tempo de leitura (ex: "5 min de leitura")
 */
function calculateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min de leitura`;
}
