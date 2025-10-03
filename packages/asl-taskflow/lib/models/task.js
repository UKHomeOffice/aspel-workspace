const { v4: uuid } = require('uuid');
const Model = require('../db/task');
const { NotFoundError, InvalidRequestError, UnauthorisedError } = require('../errors');
const { forOwn } = require('lodash');
const normaliseComments = require('../activitylog/normalise-comments');

function asJsonAccessor(field) {
  const [, ...parts] = [...field.split('.')]
    // these are json keys - limit char set to protect against injection
    .filter(part => part.match(/^[a-zA-Z]+$/))
    .map(part => `'${part}'`);

  const last = parts.pop();

  return `${['data', ...parts].join(' -> ')} ->> ${last}`;
}

class Task {

  constructor(model = {}, transaction) {
    this.id = model.id;
    this._status = model.status;
    this._data = model.data;
    this._activityLog = normaliseComments(model.activityLog || []);
    this._createdAt = model.createdAt;
    this._updatedAt = model.updatedAt;
    this._assignedTo = model.assignedTo;

    Object.defineProperty(this, 'transaction', { value: transaction });
  }

  toJSON() {
    return {
      id: this.id,
      status: this._status,
      data: this._data,
      activityLog: this._activityLog,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      assignedTo: this._assignedTo
    };
  }

  status(status, { user, payload }) {
    const previous = this._status;
    if (!status) {
      throw new InvalidRequestError({ status: 'required' });
    }
    if (!status.match(/^[a-z-]+$/)) {
      throw new InvalidRequestError({ status: 'invalid' });
    }

    return Task.hooks.invoke({
      event: `status:${previous}:${status}`,
      id: this.id,
      meta: {
        previous,
        next: status,
        user,
        payload
      },
      transaction: this.transaction,
      handler: () => Task.query(this.transaction).patchAndFetchById(this.id, { status })
    });
  }

  assign(assignedTo, { user, payload }) {
    return Task.hooks.invoke({
      event: 'assign',
      id: this.id,
      meta: {
        assignedTo,
        user,
        payload
      },
      transaction: this.transaction,
      handler: () => Task.query(this.transaction).context({ preserveUpdatedAt: true }).patchAndFetchById(this.id, { assignedTo })
    });
  }

  patch(data, opts) {
    return Task.query(this.transaction).findById(this.id)
      .then(result => {
        return this.update({ ...result.data, ...data }, opts);
      });
  }

  update(data, { user, payload, preserveUpdatedAt = false }) {
    return Task.hooks.invoke({
      event: 'update',
      id: this.id,
      meta: {
        data,
        user,
        payload
      },
      transaction: this.transaction,
      handler: () => Task.query(this.transaction).context({ preserveUpdatedAt }).patchAndFetchById(this.id, { data })
    });
  }

  static query(transaction) {
    return this.Model.query(transaction);
  }

  static relatedQuery(transaction) {
    return this.Model.relatedQuery(transaction);
  }

  static db(db) {
    Object.defineProperty(this, 'Model', {
      value: Model.bindKnex(db),
      configurable: true
    });
  }

  static setHooks(hooks) {
    Object.defineProperty(this, 'hooks', {
      value: hooks,
      configurable: true
    });
  }

  static list() {
    return this.query().select();
  }

  static filterByParams(params) {
    let query = this.query().select();

    if (params.status) {
      const statuses = Array.isArray(params.status) ? params.status : [params.status];

      query.andWhere(builder => {
        statuses.map(status => {
          builder.orWhere('status', status);
        });
      });
    }

    if (params.data) {
      query.andWhere(builder => {
        builder.whereJsonSupersetOf('data', params.data);
      });
    }

    if (params.exclude) {
      query.andWhere(builder => {
        forOwn(params.exclude, (values, key) => {
          const valuesArr = Array.isArray(values) ? values : [values];
          valuesArr.map(value => {
            builder.whereNot(key, value);
          });
        });
      });
    }

    const {
      limit,
      offset,
      sort
    } = params;

    query = this.paginate({ query, limit, offset });
    query = this.orderBy({ query, sort });

    return query;
  }

  static create(data, { user, payload, transaction }) {
    const model = {
      id: uuid(),
      status: 'new',
      data
    };
    return Task.hooks.invoke({
      event: 'create',
      id: model.id,
      meta: {
        user,
        data,
        payload
      },
      transaction,
      handler: () => this.Model.query(transaction).insert(model)
    });
  }

  static find(id, transaction) {
    return this.Model.query(transaction).findById(id)
      .withGraphFetched('activityLog(orderByCreatedAt)')
      .modifiers({
        orderByCreatedAt(builder) {
          builder.orderBy('activityLog.createdAt', 'DESC');
        }
      })
      .then(model => {
        if (!model) {
          throw new NotFoundError();
        }
        return new Task(model, transaction);
      });
  }

  static paginate({ query, limit = 100, offset = 0 }) {

    const limitInt = parseInt(limit, 10);
    const offsetInt = parseInt(offset, 10);
    const page = offsetInt / limitInt;

    return query.page(page, limitInt);
  }

  static orderBy({ query, sort = {} }) {
    if (!sort.column) {
      return query;
    }
    if (typeof sort.ascending === 'string') {
      sort.ascending = sort.ascending === 'true';
    }

    if (sort.column?.startsWith('data.')) {
      const column = asJsonAccessor(sort.column);
      return query.orderByRaw(`${column} ${sort.ascending ? 'ASC' : 'DESC'}`);
    }

    return query
      .orderBy(sort.column, sort.ascending ? 'asc' : 'desc');
  }

  static filterBySearchTerm(query, term, fields) {
    if (!term || !(fields?.length)) {
      return query;
    }

    return query.andWhere(builder => {
      const words = term.split(/\s+/);
      fields.forEach(fieldSpec => {
        if (fieldSpec.startsWith('data.')) {
          const field = asJsonAccessor(fieldSpec);
          words.forEach(word => builder.orWhereRaw(`${field} LIKE ?`, [`%${word}%`]));
        } else {
          words.forEach(word => builder.orWhere(fieldSpec, 'like', `%${word}%`));
        }
      });
    });
  }

  comment(comment, { user, payload }) {
    return Task.hooks.invoke({
      event: 'comment',
      id: this.id,
      meta: {
        user,
        comment,
        payload
      },
      transaction: this.transaction,
      handler: () => Promise.resolve()
    });
  }

  userAuthoredComment(commentId, user) {
    const comment = this._activityLog.find(log => log.id === commentId);
    return comment.changedBy === user.profile.id;
  }

  updateComment(id, comment, { user, payload }) {
    if (!this.userAuthoredComment(id, user)) {
      throw new UnauthorisedError('only comment authors may update a comment');
    }

    return Task.hooks.invoke({
      event: 'update-comment',
      id: this.id,
      meta: {
        id,
        user,
        comment,
        payload
      },
      transaction: this.transaction,
      handler: () => Promise.resolve()
    });
  }

  deleteComment(id, { user }) {
    if (!this.userAuthoredComment(id, user)) {
      throw new UnauthorisedError('only comment authors may delete a comment');
    }

    return Task.hooks.invoke({
      event: 'delete-comment',
      id: this.id,
      meta: {
        id,
        user
      },
      transaction: this.transaction,
      handler: () => Promise.resolve()
    });
  }
}

module.exports = Task;
