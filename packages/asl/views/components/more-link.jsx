const React = require('react');

const MoreLink = ({
  handleClick,
  showing
}) => (
  <p>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleClick()
      }}
    >
      { showing ? 'Less' : 'More' }
    </a>
  </p>
);

module.exports = MoreLink;
