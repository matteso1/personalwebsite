import { supabase, isSupabaseConfigured } from "./supabase";
import localPosts from "../data/blogPosts";

/**
 * Fetch the published post list.
 *
 * If Supabase is configured, pull from `posts` (RLS scopes anonymous reads to
 * published rows). Otherwise fall back to the static markdown imports so the
 * site keeps working in dev without env vars.
 */
export async function listPosts() {
  if (!isSupabaseConfigured) return localPosts;

  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, subtitle, summary, tags, read_time, published_at, github_url, demo_url")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return localPosts;
  return data.map(normalize);
}

export async function getPost(slug) {
  const local = localPosts.find((p) => p.slug === slug);

  if (!isSupabaseConfigured) return local || null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return local || null;
  return normalize(data);
}

export async function upsertPost(post) {
  if (!isSupabaseConfigured) throw new Error("Supabase not configured");
  const row = {
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle || null,
    summary: post.summary || null,
    content: post.content,
    tags: post.tags || [],
    read_time: post.readTime || null,
    github_url: post.github || null,
    demo_url: post.demo || null,
    published: !!post.published,
    published_at: post.published ? (post.publishedAt || new Date().toISOString()) : null,
  };
  const { data, error } = await supabase
    .from("posts")
    .upsert(row, { onConflict: "slug" })
    .select()
    .single();
  if (error) throw error;
  return normalize(data);
}

function normalize(row) {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    date: row.published_at || row.created_at,
    readTime: row.read_time,
    tags: row.tags || [],
    github: row.github_url,
    demo: row.demo_url,
    content: row.content,
  };
}
