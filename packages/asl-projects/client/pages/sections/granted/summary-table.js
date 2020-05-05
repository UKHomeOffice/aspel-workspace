import React, { Fragment, useState } from 'react';
import classnames from 'classnames';
import { getLegacySpeciesLabel } from '../../../helpers';
import { filterSpeciesByActive } from '../protocols/animals';

function titleCase(str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
}

function TableRow({ species, protocol, index, isLegacy, ExpandingRow, expanded, onClick }) {
  // this is necessary due to :hover css not taking rowspan into account.
  const [hover, setHover] = useState(false)
  function onMouseEnter() {
    setHover(true);
  }

  function onMouseLeave() {
    setHover(false);
  }

  const showExpandingRow = ExpandingRow && !isLegacy;

  return species.map((s, speciesIndex) => {
    const isLastRow = speciesIndex === species.length - 1;
    return (
      <Fragment key={index + speciesIndex}>
        <tr onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} className={classnames({ expandable: ExpandingRow, hover, expanded })}>
          {
            (speciesIndex === 0) && (
              <Fragment>
                <td rowSpan={species.length || 1} className="is-last-row">
                  <span className={classnames({ expanding: ExpandingRow, expanded })}>{ index + 1 }</span>
                </td>
                <td rowSpan={species.length || 1} className="is-last-row">{ protocol.title }</td>
              </Fragment>
            )
          }
          <td className={classnames({ 'is-last-row': isLastRow })}>{ s.name }</td>
          {
            isLegacy
              ? <td>{s.quantity}</td>
              : (
                <Fragment>
                  <td className={classnames({ 'is-last-row': isLastRow })}>{ s['maximum-animals'] }</td>
                  <td className={classnames({ 'is-last-row': isLastRow })}>{ s['maximum-times-used'] }</td>
                </Fragment>
              )
          }
          <td className={classnames({ 'is-last-row': isLastRow })}>
            {
              isLegacy
                ? s['life-stages']
                : (s['life-stages'] || []).map(titleCase).join(', ')
              }
          </td>
          {
            isLegacy && <td>{s['genetically-altered'] === true ? 'Yes' : 'No'}</td>
          }
          {
            speciesIndex === 0 && (
              <Fragment>
                {
                  !isLegacy && <td rowSpan={species.length || 1} className="is-last-row">{ protocol.gaas === true ? 'Yes' : 'No' }</td>
                }
                <td rowSpan={species.length || 1} className="is-last-row">{ protocol.severity && titleCase(protocol.severity) }</td>
              </Fragment>
            )
          }
        </tr>
        {
          showExpandingRow && speciesIndex === species.length - 1 && (
            <tr className={classnames({ hidden: !expanded })}>
              <td colSpan="8" className="expanding-container">
                <ExpandingRow protocol={protocol} />
              </td>
            </tr>
          )
        }
      </Fragment>
    )
  })
}

export default function SummaryTable({ protocols, isLegacy, project, className, ExpandingRow }) {
  const [expanded, setExpanded] = useState(protocols.map(() => false));

  function setAllExpanded(e) {
    e.preventDefault()
    if (expanded.every(item => item)) {
      return setExpanded(expanded.map(() => false));
    }
    setExpanded(expanded.map(() => true));
  }

  function onRowClick(index) {
    return () => {
      setExpanded(expanded.map((item, i) => {
        if (i === index) {
          return !item;
        }
        return item;
      }))
    }
  }

  return (
    <Fragment>
      {
        ExpandingRow && (
          <a href="#" onClick={setAllExpanded} className="float-right">
            {
              expanded.every(item => item)
                ? 'Collapse all protocols'
                : 'Expand all protocols'
            }
          </a>
        )
      }
      <table className={className}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Protocol</th>
            <th>Animal types</th>
            {
              isLegacy
                ? <th>Est. numbers</th>
                : (
                  <Fragment>
                    <th>Max. no. of animals</th>
                    <th>Max. no. of uses per animal</th>
                  </Fragment>
                )
            }
            <th>Life stages</th>
            <th>GA</th>
            <th>Severity category</th>
          </tr>
        </thead>
        <tbody>
          {
            (protocols || []).map((protocol, index) => {
              const species = !isLegacy
                ? filterSpeciesByActive(protocol, project)
                : (protocol.species || []).map(s => {
                  const label = getLegacySpeciesLabel(s);
                  return {
                    ...s,
                    name: label || '-'
                  };
                });
              return <TableRow
                key={index}
                species={species}
                protocol={protocol}
                index={index}
                isLegacy={isLegacy}
                ExpandingRow={ExpandingRow}
                expanded={expanded[index]}
                onClick={onRowClick(index)}
              />
            })
          }
        </tbody>
      </table>
    </Fragment>
  )
}
