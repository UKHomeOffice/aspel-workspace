import { withRouter } from 'react-router';
import { connect } from 'react-redux';

export const parseIfInt = val => {
  return /^[\d]+$/.test(val)
    ? parseInt(val, 10)
    : val
};

const mapProject = (state, props) => {
  const { id } = props.match.params;
  return {
    project: state.projects.find(p => p.id === parseIfInt(id)) || {}
  };
}

export const connectProject = Component => withRouter(connect(mapProject)(Component));

const mapSettings = (state) => {
  return {
    settings: state.settings
  };
};

export const connectSettings = Component => connect(mapSettings)(Component)

export const getScrollPos = (elem, offset = 0) => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop) + offset;
};
