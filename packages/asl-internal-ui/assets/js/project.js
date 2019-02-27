import start from '@asl/peephole';

const state = window.INITIAL_STATE;

start({
  basename: state.static.basename,
  readonly: true
}, {
  project: {
    ...state.model.data,
    id: state.model.id
  },
  settings: {
    establishments: state.static.establishments.map(e => e.name)
  }
});
