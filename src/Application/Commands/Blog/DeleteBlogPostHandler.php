<?php

namespace WouterDeSchuyter\Application\Commands\Blog;

use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Blog\DeleteBlogPost;

class DeleteBlogPostHandler
{
    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @param BlogPostRepository $blogPostRepository
     */
    public function __construct(BlogPostRepository $blogPostRepository)
    {
        $this->blogPostRepository = $blogPostRepository;
    }

    /**
     * @param DeleteBlogPost $deleteBlogPost
     */
    public function handle(DeleteBlogPost $deleteBlogPost)
    {
        $this->blogPostRepository->delete($deleteBlogPost->getBlogPostId());
    }
}
