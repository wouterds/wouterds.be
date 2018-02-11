<?php

namespace WouterDeSchuyter\Application\Commands\Blog;

use League\Tactician\CommandBus;
use WouterDeSchuyter\Domain\Blog\BlogPostBuilder;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Blog\SaveBlogPost;
use WouterDeSchuyter\Domain\Commands\Media\GenerateStructuredDataMedia;

class SaveBlogPostHandler
{
    /**
     * @var CommandBus
     */
    private $commandBus;

    /**
     * @var BlogPostRepository
     */
    private $blogPostRepository;

    /**
     * @param CommandBus $commandBus
     * @param BlogPostRepository $blogPostRepository
     */
    public function __construct(CommandBus $commandBus, BlogPostRepository $blogPostRepository)
    {
        $this->commandBus = $commandBus;
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

        if ($saveBlogPost->getPublishedAt()) {
            $blogPostBuilder->withPublishedAt($saveBlogPost->getPublishedAt());
        }

        $blogPost = $blogPostBuilder->build();
        if ($saveBlogPost->getBlogPostId()) {
            $blogPostBuilder->withId($saveBlogPost->getBlogPostId());
            $blogPost = $blogPostBuilder->build();
            $this->blogPostRepository->update($blogPost);
        }

        if (!$saveBlogPost->getBlogPostId()) {
            $this->blogPostRepository->add($blogPost);
        }

        $this->commandBus->handle(new GenerateStructuredDataMedia($blogPost->getMediaId()));
    }
}
