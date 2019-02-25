import React from 'react';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { connect } from 'react-redux';

const replace = params => fragment => {
  return fragment[0] === ':' ? params[fragment.substr(1)] : fragment;
};

const Link = ({
  url,
  urls,
  page,
  path,
  label,
  className,
  ...props
}) => {
  if (page) {
    const href = get(urls, page);
    if (typeof href !== 'string') {
      throw new Error(`Unknown link target: ${page}`);
    }
    const replacer = replace(props);
    url = href.split('/').map(replacer).join('/');
    return <a className={className} href={url}>{label}</a>;
  } else {
    return <a className={className} href={`${url}/${path}`}>{label}</a>;
  }
};

const mapStateToProps = (state, props) => {
  return Object.assign({},
    pick(state.static,
      'url',
      'urls',
      'establishmentId',
      'profileId',
      'pilId',
      'projectId',
      'versionId',
      'placeId'
    ), props);
};

export default connect(mapStateToProps)(Link);
