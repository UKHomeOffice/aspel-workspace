const EstablishmentModel = require('./establishment');
const PlaceModel = require('./place');
const RoleModel = require('./role');
const ProfileModel = require('./profile');
const AuthorisationModel = require('./authorisation');
const PILModel = require('./pil');
const ProjectModel = require('./project');

module.exports = db => {

  const Establishment = EstablishmentModel(db);
  const Place = PlaceModel(db);
  const Role = RoleModel(db);
  const Profile = ProfileModel(db);
  const Authorisation = AuthorisationModel(db);
  const PIL = PILModel(db);
  const Project = ProjectModel(db);

  Establishment.places = Establishment.hasMany(Place);
  Establishment.authorisations = Establishment.hasMany(Authorisation);
  Establishment.hasMany(Role);
  Establishment.hasMany(Profile);
  Establishment.hasMany(PIL);
  Establishment.hasMany(Project);

  Place.nacwo = Place.belongsTo(Role, { as: 'nacwo' });
  Place.establishment = Place.belongsTo(Establishment, { as: 'establishment' });

  Role.profile = Role.belongsTo(Profile);
  Role.hasMany(Place, { foreignKey: 'nacwoId' });
  Profile.hasMany(Role);

  Profile.establishment = Profile.belongsTo(Establishment);

  PIL.establishment = PIL.belongsTo(Establishment);
  PIL.profile = PIL.belongsTo(Profile);
  Profile.pil = Profile.hasOne(PIL);

  Project.establishment = Project.belongsTo(Establishment);
  Project.holder = Project.belongsTo(Profile, { as: 'licenceHolder' });
  Profile.hasMany(Project);

  return {
    Establishment,
    Place,
    Role,
    Profile,
    Authorisation,
    PIL,

    sync: opts => db.sync(opts),
    close: () => db.close()
  };

};
