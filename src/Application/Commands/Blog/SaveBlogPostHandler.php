<?php

namespace WouterDeSchuyter\Application\Commands\Blog;

use WouterDeSchuyter\Domain\Blog\BlogPostBuilder;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Blog\SaveBlogPost;

class SaveBlogPostHandler
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
     * @param SaveBlogPost $saveBlogPost
     */
    public function handle(SaveBlogPost $saveBlogPost)
    {
        $blogPostBuilder = BlogPostBuilder::startWithDefault();

        $blogPostBuilder->withUserId($saveBlogPost->getUserId());
        $blogPostBuilder->withMediaId($saveBlogPost->getMediaId());
        $blogPostBuilder->withTitle($saveBlogPost->getTitle());
        $blogPostBuilder->withSlug($saveBlogPost->getSlug());
        $blogPostBuilder->withExcerpt($saveBlogPost->getExcerpt());
        $blogPostBuilder->withBody($saveBlogPost->getBody());
        $blogPostBuilder->withPublishedAt($saveBlogPost->getPublishedAt());

        if ($saveBlogPost->getBlogPostId()) {
            $blogPostBuilder->withId($saveBlogPost->getBlogPostId());
            $this->blogPostRepository->update($blogPostBuilder->build());
            return;
        }

        $this->blogPostRepository->add($blogPostBuilder->build());
    }
}
