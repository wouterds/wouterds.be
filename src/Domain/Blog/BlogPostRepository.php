<?php

namespace WouterDeSchuyter\Domain\Blog;

interface BlogPostRepository
{
    /**
     * @param BlogPost $blogPost
     */
    public function add(BlogPost $blogPost);
}
