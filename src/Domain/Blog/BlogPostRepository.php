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
}
