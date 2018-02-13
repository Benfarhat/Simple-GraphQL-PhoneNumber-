const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
  } = require ('graphql/type');
const PhoneNumberModelMongoose = require('../Models/mongoose').PhoneNumber;

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
var getProjection = function (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var PhoneNumberType = new GraphQLObjectType({
  name: 'PhoneNumber',
  description: 'Phone Contact',
  fields: () => ({
    itemId: {
      type: (GraphQLInt),
      description: 'The id of the contact.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the contact.',
    },
    phone: {
      type: GraphQLString,
      description: 'The number of the contact.',
    },
    isActive: {
      type: GraphQLBoolean,
      description: 'Contact enabled? '
    }
  })
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      contact: {
        type: new GraphQLList(PhoneNumberType),
        args: {
          itemId: {
            name: 'itemId',
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: (root, {itemId}, source, fieldASTs) => {
          var projections = getProjection(fieldASTs);
          var foundItems = new Promise((resolve, reject) => {
            PhoneNumberModelMongoose.find({itemId}, projections,(err, contacts) => {
                  err ? reject(err) : resolve(contacts)
              })
          })

          return foundItems
        }
      },
      contacts: {
        type: new GraphQLList(PhoneNumberType),
        args: {
        },
        resolve: (root, {itemId}, source, fieldASTs) => {
          var projections = getProjection(fieldASTs);
          var foundItems = new Promise((resolve, reject) => {
            PhoneNumberModelMongoose.find({}, projections,(err, contacts) => {
                  err ? reject(err) : resolve(contacts)
              })
          })

          return foundItems
        }
      }
    }
  })
  
});

module.exports.schema = schema;