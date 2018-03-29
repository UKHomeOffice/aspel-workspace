const React = require('react');

module.exports = ({
  id,
  handleClick,
  collapsed
}) => (
  <p>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleClick(id)
      }}
    >
      { collapsed ? 'More' : 'Less' }
    </a>
  </p>
)
