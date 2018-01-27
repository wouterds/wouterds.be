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
     * @param BlogPost $blogPost
     */
    public function viewed(BlogPost $blogPost): void;

    /**
     * @return BlogPost[]
     */
    public function findAll(): array;

    /**
     * @return BlogPost[]
     */
    public function findPublished(): array;

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
