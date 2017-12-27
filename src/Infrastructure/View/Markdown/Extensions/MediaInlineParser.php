<?php

namespace WouterDeSchuyter\Infrastructure\View\Markdown\Extensions;

use League\CommonMark\Inline\Parser\AbstractInlineParser;
use League\CommonMark\InlineParserContext;
use Ramsey\Uuid\Exception\InvalidUuidStringException;
use WouterDeSchuyter\Domain\Media\MediaId;

class MediaInlineParser extends AbstractInlineParser
{
    /**
     * @return string[]
     */
    public function getCharacters()
    {
        return [':'];
    }

    /**
     * @param InlineParserContext $inlineContext
     * @return bool
     */
    public function parse(InlineParserContext $inlineContext)
    {
        $cursor = $inlineContext->getCursor();
        $savedState = $cursor->saveState();
        $cursor->advance();

        if (!$cursor->match('/media\:/')) {
            $cursor->restoreState($savedState);
            return false;
        }

        $rawMediaId = $cursor->match('/.+[^:]/');

        // Advance 1 more time to select last colon
        $cursor->advance();

        try {
            $mediaId = new MediaId($rawMediaId);
        } catch (InvalidUuidStringException $e) {
            $cursor->restoreState($savedState);
            return false;
        }

        $mediaInlineBlock = new MediaInline();
        $mediaInlineBlock->setMediaId($mediaId);
        $inlineContext->getContainer()->appendChild($mediaInlineBlock);

        return true;
    }
}
