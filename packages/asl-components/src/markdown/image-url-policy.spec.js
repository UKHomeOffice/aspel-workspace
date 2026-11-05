import React from 'react';
import { render, screen } from '@testing-library/react';
import { filterImageUrl, isAllowedImageUrl } from './image-url-policy';
import { SECURITY_IMAGE_URL_FIXTURES } from './security-image-url-fixtures';
import Markdown from './index';

describe('markdown image URL policy', () => {
    it('classifies fixtures with expected allow/deny decisions', () => {
        const mismatches = SECURITY_IMAGE_URL_FIXTURES
            .filter(({ url, allowed }) => isAllowedImageUrl(url) !== allowed || Boolean(filterImageUrl(url)) !== allowed)
            .map(({ category, url, allowed }) => ({
                category,
                url,
                expected: allowed,
                actual: isAllowedImageUrl(url)
            }));

        expect(mismatches).toEqual([]);
    });

    it('renders only images with allowed URLs', () => {
        const renderableFixtures = SECURITY_IMAGE_URL_FIXTURES
            .filter(({ url }) => !url.startsWith('data:'));

        const fixtureMarkdown = renderableFixtures
            .map(({ category, url }, index) => `![${category}-${index}](<${url}>)`)
            .join('\n\n');

        render(<Markdown>{fixtureMarkdown}</Markdown>);

        renderableFixtures.forEach(({ category, allowed }, index) => {
            const alt = `${category}-${index}`;
            if (allowed) {
                expect(screen.getByAltText(alt)).toBeInTheDocument();
            }
            else {
                expect(screen.queryByAltText(alt)).not.toBeInTheDocument();
            }
        });
    });
});



