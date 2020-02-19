import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

const replace = params => fragment => {
  return fragment[0] === ':' ? params[fragment.substr(1)] : fragment;
};

function getUrl(urls, parts, replacer) {
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

const Link = ({
  url,
  urls,
  page,
  path,
  label,
  className,
  isPdf,
  ...props
}) => {
  if (isPdf) {
    return null;
  }

  if (page) {
    const parts = page.split('.');
    const replacer = replace(props);
    const href = getUrl(urls, parts, replacer);

    return <a className={className} href={href}>{label}</a>;
  } else {
    return <a className={className} href={`${url}/${path}`}>{label}</a>;
  }
};

const mapStateToProps = (state, props) => {
  return {
    ...state.static,
    ...props
  };
};

export default connect(mapStateToProps)(Link);
