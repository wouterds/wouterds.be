<?php

namespace WouterDeSchuyter\Domain\Blog;

interface BlogPostRepository
{
    /**
     * @param BlogPost $blogPost
     */
    public function add(BlogPost $blogPost);

    /**
     * @param BlogPost $blogPost
     */
    public function update(BlogPost $blogPost);

    /**
     * @return BlogPost[]
     */
    public function findAll(): array;

    /**
     * @param BlogPostId $id
     * @return BlogPost|null
     */
    public function find(BlogPostId $id): ?BlogPost;

    /**
     * @param string $slug
     * @return BlogPost|null
     */
    public function findBySlug(string $slug): ?BlogPost;

    /**
     * @param BlogPostId $id
     */
    public function delete(BlogPostId $id);
}
