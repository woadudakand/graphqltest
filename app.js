const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const events = [];
const mongoose = require('mongoose');

const Event = require('./models/event');

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

app.use(bodyParser.json())

var eventSchema = buildSchema(`
  type Event {
    _id : ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }
  type Query {
    events: [Event!]!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type Mutation {
    createEvent(eventInput : EventInput) : Event
  }

  schema {
    query : Query
    mutation : Mutation
  }
`);
var root = { 
  events : () => {
    return Event.find().then( events => {
      return events.map(event => {
        return {...event._doc}
      })
    }).catch( err => {
      throw err
    });
  },
  createEvent : (arg) => {       
    const event = new Event ({
        title : arg.eventInput.title,
        description : arg.eventInput.description,
        price : +arg.eventInput.price,
        date : arg.eventInput.date
    });
    return event.save().then((result) => {

        return {...result._doc}
    }).catch(err => {

        throw err;
    });    
  }
};

app.use('/graphql', graphqlHTTP({
    schema: eventSchema,
    rootValue: root,
    graphiql: true,
}));

mongoose.connect('mongodb://localhost:27017/graphql').then(() => {
      app.listen(3000);
}).catch( err => {
    console.log(err);
})

