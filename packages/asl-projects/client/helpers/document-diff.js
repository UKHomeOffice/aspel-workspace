import get from 'lodash/get';

const { diffWords } = require('diff');
const last = require('lodash/last');

// eslint-disable-next-line no-control-regex
const normaliseWhitespace = str => str.replace(/[\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f]/g, '');

// Find the old steps field data (document)
export const findSteps = (version, previousProtocols, protocolId, stepId, fieldName) => {
  let step;
  let protocolIndex;
  if (version === 'granted') {
    protocolIndex = previousProtocols.granted.indexOf(protocolId);
    step = get(previousProtocols.grantedSteps[protocolIndex].find(s => s.id === stepId), fieldName, undefined);
  } else if (version === 'first') {
    protocolIndex = previousProtocols.first.indexOf(protocolId);
    step = get(previousProtocols.firstSteps[protocolIndex].find(s => s.id === stepId), fieldName, undefined);
  } else {
    protocolIndex = previousProtocols.previous.indexOf(protocolId);
    step = get(previousProtocols.steps[protocolIndex].find(s => s.id === stepId), fieldName, undefined);
  }
  return step;
};

export const getChanges = (current, before, granularity = 'word') => {
  let currentText = '';
  let beforeText = '';
  if (Array.isArray(current?.document?.nodes)) {
    current.document.nodes.forEach((element) => currentText += element?.nodes[0]?.text);
  }
  if (Array.isArray(before?.document?.nodes)) {
    before.document.nodes.forEach((element) => beforeText += element?.nodes[0]?.text);
  }
  const diffs = diffWords(normaliseWhitespace(beforeText), normaliseWhitespace(currentText));
  let added = [];
  let removed = [];
  removed = diffs.reduce((arr, d) => {
    // ignore additions
    if (!d.added) {
      const prev = last(arr);
      const start = prev ? prev.start + prev.count : 0;
      return [...arr, { ...d, start, count: d.value.length }];
    }
    return arr;
  }, []).filter(d => d.removed);

  added = diffs.reduce((arr, d) => {
    // ignore removals
    if (!d.removed) {
      const prev = last(arr);
      const start = prev ? prev.start + prev.count : 0;
      return [...arr, { ...d, start, count: d.value.length }];
    }
    return arr;
  }, []).filter(d => d.added);

  return { added, removed, granularity };
};
