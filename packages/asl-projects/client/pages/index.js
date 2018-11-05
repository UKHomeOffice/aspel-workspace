import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DropZone from 'react-dropzone';

import { deleteProject, importProject } from '../actions/projects';
import { throwError } from '../actions/messages';

const mapStateToProps = state => {
  return {
    projects: state.projects
  };
}
const mapDispatchToProps = dispatch => {
  return {
    error: message => dispatch(throwError(message)),
    import: data => dispatch(importProject(data)),
    remove: id => dispatch(deleteProject(id))
  };
}

class Index extends React.Component {

  drop(files, rejected) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          this.props.import(obj);
        } catch (e) {
          return this.props.error(`Error importing file: ${e.message}`);
        }
      };
      reader.readAsBinaryString(file);
    });
  }

  render() {
    return <DropZone
      onDrop={files => this.drop(files)}
      onDropRejected={files => this.props.error(`Invalid file type: ${files[0].type}`)}
      accept="application/json"
      activeClassName="import-active"
      rejectClassName="import-rejected"
      style={{}}
      disableClick={true}
      >
      <h1>Your projects</h1>
      <table className="govuk-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.projects.map(project => {
            return <tr key={ project.id }>
              <td><Link to={`/project/${project.id}`}>{ project.title }</Link></td>
              <td>{ moment(project.updated).format('D MMMM YYYY, HH:mm') }</td>
              <td><button onClick={() => this.props.remove(project.id)} className="govuk-button">Remove</button></td>
            </tr>
          })
        }
        </tbody>
      </table>
      <p className="control-panel">
        <Link to="/new" className="govuk-button">Add new project</Link>
        <span>or drag an exported json file onto this window to import it.</span>
      </p>
    </DropZone>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
