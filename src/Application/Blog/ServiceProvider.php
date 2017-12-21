<?php

namespace WouterDeSchuyter\Application\Blog;

use League\Container\ServiceProvider\AbstractServiceProvider;
use WouterDeSchuyter\Domain\Blog\BlogPostRepository;

class ServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        BlogPostRepository::class,
    ];

    /**
     * @inheritdoc
     */
    public function register()
    {
        $this->container->share(BlogPostRepository::class, function () {
            return $this->container->get(DbalBlogPostRepository::class);
        });
    }
}
