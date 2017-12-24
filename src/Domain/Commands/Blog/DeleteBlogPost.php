<?php

namespace WouterDeSchuyter\Domain\Commands\Blog;

use WouterDeSchuyter\Domain\Blog\BlogPostId;

class DeleteBlogPost
{
    /**
     * @var BlogPostId
     */
    private $blogPostId;

    /**
     * @param BlogPostId $blogPostId
     */
    public function __construct(BlogPostId $blogPostId)
    {
        $this->blogPostId = $blogPostId;
    }

    /**
     * @return BlogPostId
     */
    public function getBlogPostId(): BlogPostId
    {
        return $this->blogPostId;
    }
}
