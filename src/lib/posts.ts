export interface BlogPost {
  slug: string;
  title: string;
  preview: string;
  content: string;
  date: string;
  readTime: string;
  color: string;
  sortDate: string;
}

const ACCENT_COLORS = ['#ff71ce', '#01cdfe', '#fffb96', '#05ffa1', '#a100ff'];

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('---')) {
    return { data: {}, content: trimmed };
  }

  const end = trimmed.indexOf('---', 3);
  if (end === -1) {
    return { data: {}, content: trimmed };
  }

  const frontmatter = trimmed.slice(3, end).trim();
  const content = trimmed.slice(end + 3).trim();
  const data: Record<string, string> = {};

  for (const line of frontmatter.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content };
}

const postFiles = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace('.md', '');
}

export const blogPosts: BlogPost[] = Object.entries(postFiles)
  .map(([path, raw], index) => {
    const { data, content } = parseFrontmatter(raw);
    const slug = slugFromPath(path);

    return {
      slug,
      title: data.title ?? slug,
      preview: data.preview ?? content.slice(0, 160).trim(),
      content,
      date: data.date ?? '',
      readTime: data.readTime ?? '',
      color: data.color ?? ACCENT_COLORS[index % ACCENT_COLORS.length],
      sortDate: data.sortDate ?? '1970-01-01',
    };
  })
  .sort((a, b) => b.sortDate.localeCompare(a.sortDate));
