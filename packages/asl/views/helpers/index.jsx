const React = require('react');
const Acronym = require('../components/acronym');
const Join = require('../components/join');

const joinAcronyms = arr => <Join>{ arr.map(a => <Acronym key={a}>{a}</Acronym>) }</Join>;
const renderNacwo = nacwo => nacwo
  ? <a href={`/profile/${nacwo.profile.id}`}>{ nacwo.profile.name }</a>
  : '-';

const acronym = key => <Acronym>{key.toUpperCase()}</Acronym>;

module.exports = {
  joinAcronyms,
  renderNacwo,
  acronym
};
