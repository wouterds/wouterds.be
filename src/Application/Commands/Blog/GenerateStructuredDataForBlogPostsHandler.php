<?php

namespace WouterDeSchuyter\Application\Commands\Blog;

use League\Tactician\CommandBus;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;
use WouterDeSchuyter\Domain\Commands\Blog\GenerateStructuredDataForBlogPosts;
use WouterDeSchuyter\Domain\Commands\Media\GenerateStructuredDataMedia;

class GenerateStructuredDataForBlogPostsHandler
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
     * @param GenerateStructuredDataForBlogPosts $generateStructuredDataForBlogPosts
     */
    public function handle(GenerateStructuredDataForBlogPosts $generateStructuredDataForBlogPosts)
    {
        $blogPosts = $this->blogPostRepository->findPublished();

        foreach ($blogPosts as $blogPost) {
            $this->commandBus->handle(new GenerateStructuredDataMedia($blogPost->getMediaId()));
        }
    }
}
