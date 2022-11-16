const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');


const app = express()
app.use(express.json())


//(2) we have endpoint /graphql but are unable to query data until we define queries inside schema 
// let's suppose this will accept a query Hello and return a string "hello world"
// but which string should be returned we will define this in a function

/*
inside graphlql we have certain scalar types builtin 
 ID 
 String
 Int 

 Float 
 List []
 Bolean

 to create your own type you can define your own type wich is object type
 User is custom defined object type
*/

let message = "This is something "

const schema = buildSchema(`

type Post {
    userId: Int,
    id: Int,
    title: String,
    body: String 
}

type User {
    name: String!
    age: Int! 
    college: String!
}
  
  type Query {
    hello: String!,
    welcomeMessage(name:String,dayOfWeek:String): String
    getUser: User
    getUSers:[User]
    getPostsFromExternalApi: [Post] 
    message: String
  }

  input userInput {
    name: String!,
    age: Int!,
    college: String!
  }

  type Mutation {
    setMessage(newMessage:String): String
    createUser(user: userInput): User
  }

`)

// reference for inputUser 
// createUser(name: String!, age: Int!, college: String!): User



// welcomeMessage(name:String) => is a parameter should be provided by a user

// we can do multiple queries requests 
const root = {
    // contains all the resolvers for mutations and queries
    // we will create a resolver function four our hello query
    hello: () => {
        return "hello";
    },
    welcomeMessage: (args) => {
        // console.log(args)
        return `Hey, ${args.name} hows life,today is ${args.dayOfWeek} `
    },
    getUser: () => {
        const User = {
            name: "john doe",
            age: 26,
            college: "Brighton"
        }
        return User;
    },
    getUsers: () => {
        const getUsers = [
            {
                name: "john doe",
                age: 26,
                college: "Brighton"
            },

            {
                name: "johns doe",
                age: 27,
                college: "Brighton",
            },
        ];
        return getUsers
    },

    getPostsFromExternalApi: async () => {
        const result = await axios.get(
            'https://jsonplaceholder.typicode.com/posts'
        )
        return result.data
    },
    setMessage: ({ newMessage }) => {
        message = newMessage
        return message;
    },
    message: () => message,
    createUser: args => {
        console.log(args)
        // create a new user insde your database or external api or even firestore
        return args.user
    }
};

//(1) https://localhost:4000/abx this could be any name : simply an endpoint
// graphql endpoint 
app.use('/graphql', graphqlHTTP({
    rootValue: root,
    schema: schema,
    graphiql: true,
}))




// each and everything in graphql starts with a schema

// Notes___sequence 
// 1 middleware graphql importing graphical schema rootvalue
// 2 defining schema
// 3 resolver function that validate query and resolve the results accordingly 





app.listen(4001, () => console.log(`server on port4001`));