import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { stringify } from 'qs';
import get from 'lodash/get';

const replace = params => fragment => {
    return fragment[0] === ':' ? params[fragment.substr(1)] : fragment;
};

function getHref(urls, parts, replacer) {
    let item = urls;
    const sections = parts.map(part => {
        const section = get(item, part);
        if (!section) {
            throw new Error(`Unknown link target: ${parts.join('.')}`);
        }
        item = section.routes;
        return section.path.split('/').map(replacer).join('/');
    });
    return sections.join('');
}

export function getUrl({ page, url, query, path, suffix, ...props }) {
    const { urls, ...staticProps } = useSelector(state => state.static, shallowEqual);
    let href = `${url}/${path}`;

    if (page) {
        const parts = page.split('.');
        const replacer = replace({ ...staticProps, ...props });
        href = getHref(urls, parts, replacer);
    }
    if (suffix) {
        href += suffix;
    }
    return query ? `${href}?${stringify(query)}` : href;
}

export default function Link({ label, className, target, children, ...props }) {
    const isPdf = useSelector(state => state.static.isPdf);
    if (isPdf) {
        return null;
    }

    const href = getUrl({ ...props });

    return <a className={className} href={href} target={target}>{label ?? children}</a>;
}
