# Guide

## Regenerating apps

@feathers-plus/cli, a.k.a. "cli-plus", persists a definition of the app in `project-name/feathers-gen-specs.json`.
This contains primarily the responses provided to the prompts used to create the app.

An example is:
```json
{
  "options": {
    "ver": "1.0.0",
    "inspectConflicts": false,
    "semicolons": true,
    "freeze": [],
    "ts": false
  },
  "app": {
    "name": "GraphQL-test",
    "description": "Test Feathers GraphQL adapter.",
    "src": "src",
    "packager": "npm@>= 3.0.0",
    "providers": [
      "rest",
      "socketio"
    ]
  },
  "services": {
    "users": {
      "name": "users",
      "nameSingular": "user",
      "fileName": "users",
      "adapter": "nedb",
      "path": "/users",
      "isAuthEntity": true,
      "requiresAuth": true,
      "graphql": true
    },
    "comments": {
      "name": "comments",
      "nameSingular": "comment",
      "fileName": "comments",
      "adapter": "nedb",
      "path": "/comments",
      "isAuthEntity": false,
      "requiresAuth": false,
      "graphql": true
    },
    "likes": {
      "name": "likes",
      "nameSingular": "like",
      "fileName": "likes",
      "adapter": "nedb",
      "path": "/likes",
      "isAuthEntity": false,
      "requiresAuth": false,
      "graphql": true
    },
    "posts": {
      "name": "posts",
      "nameSingular": "post",
      "fileName": "posts",
      "adapter": "nedb",
      "path": "/posts",
      "isAuthEntity": false,
      "requiresAuth": false,
      "graphql": true
    },
    "relationships": {
      "name": "relationships",
      "nameSingular": "relationship",
      "fileName": "relationships",
      "adapter": "nedb",
      "path": "/relationships",
      "isAuthEntity": false,
      "requiresAuth": false,
      "graphql": true
    },
    "permissions": {
      "name": "permissions",
      "nameSingular": "permission",
      "fileName": "permissions",
      "adapter": "sequelize",
      "path": "/permissions",
      "isAuthEntity": false,
      "requiresAuth": false,
      "graphql": false
    }
  },
  "authentication": {
    "strategies": [
      "local"
    ],
    "entity": "users"
  },
  "connections": {
    "nedb": {
      "database": "nedb",
      "adapter": "nedb",
      "connectionString": "nedb://../data"
    },
    "sequelize": {
      "database": "sqlite",
      "adapter": "sequelize",
      "connectionString": "sqlite://data/db.sqlite"
    }
  },
  "middlewares": {
    "mw1": {
      "path": "*",
      "camel": "mw1",
      "kebab": "mw-1"
    },
    "mw2": {
      "path": "mw2",
      "camel": "mw2",
      "kebab": "mw-2"
    }
  },
  "graphql": {
    "path": "/graphql",
    "strategy": "sql",
    "requiresAuth": false,
    "name": "graphql"
  }
}
```

With this, and any custom code you entered in your app,
Cli-plus can regenerate part of, or all of the app at any time.
Let's say you originally run `generate app` selecting only `socket.io` as a transport.
Later on you find a need for `REST`.
You can just rerun `generate app` and select both transports, and the code will be updated.

Cli-plus will be updated over time, fixing issues and adding enhancements.
You can include these enhancements in your app by simply running `generate all` and
the entire app will be updated.
Most of the time this'll "just work".

::: tip
Your app can obtain information about the app at run-time by reading `feathers-gen-specs.json`.
It can, for example, determine the adapter used by a service and then use that information to
decide which hooks to run.
:::

::: tip
`feathers-gen-specs.json` combined with the output from `generate codelist` completely
describe the generated modules. The generator can re-generate the project with this information.
:::


## Additional generators

Cli-plus comes with generators not in @feathersjs/cli.
See the Get Started docs for details.

### feathers-plus generate options

JavaScript or TypeScript are generated based on one of the prompts.
Another prompt determines if statements are terminated by semicolons or not.
You can view on the console the difference between a new module and its previous version with another.
This is a good way to understand what changes are being made.

The generator creates a few modules with default contents,
after which it will not change them.
This leaves you free to modify them as you wish.

You can optionally `freeze` additional modules by adding their paths to
`options.freeze` in `my-app/feathers-gen-specs.json`, e.g.
`src/services/comments/comments/validate.js`.
The generator will not change nor remove these modules.

#### Converting between JavaScript and TypeScript

You can convert an existing generated project from JavaScript to TypeScript, or vice versa.
First run `generate options` and change to the language you want to convert to.
Then run `generate all`.

The generator will recode the project, install any newly required dependencies,
and then remove the modules of the original language.

Your custom code is not transpiled.
A statement containing TypeScript tags will not be converted to correct JavaScript.
You have to handle that yourself.

:::tip
Modules of both languages cannot exist at the same time,
as their duplicate custom code would be combined by the generator.
:::

You have to manually recode any modules you `froze` and remove the one in the original language.

:::warning
**Back up your project** before converting.
:::

### feathers-plus generate all

This regenerates the entire project.
Its a good way to refresh your project with the latest generator templates and bug fixes.

### feathers-plus generate codelist

This lists all the custom code in the project.
This list, when combined with `feathers-gen-specs.json`, completely defines what the
generated modules do.

## Feathers Service Models

### Writing JSON-schema

Here is a typical JSON-schema which contains no field validation:
```javascript
const productJsonSchema = {
    type: 'object',
    properties: {
        _id: { oneOf: [{ type: 'string' }, { type: 'object' }] }, // handle both MongoDB and NeDB
        checked: { type: 'boolean' },
        name: { type: 'string' },
        price: { type: 'number' },
        tags: {
            type: 'array',
            items: { type: 'string' },
        },
        updatedAt: { type: 'number', format: 'date-time', default: Date.now },
    },
}
```

Feathers Models can default the `type` properties, so you can write more concisely:
```javascript
const productJsonSchema = {
    properties: {
        _id: { type: 'ID' },
        checked: { type: 'boolean' },
        name: {},
        price: { type: 'number' },
        tags: { items: {} },
        updatedAt: { format: 'date-time', default: Date.now },
    },
}
```

As you can see, JSON-schema is fairly straightforward.
It also has extensive capabilities for validating your data.

:::tip
You should read
[this excellent tutorial](https://code.tutsplus.com/tutorials/validating-data-with-json-schema-part-1--cms-25343)
on JSON-schema written by the author of
[`ajv`](https://github.com/epoberezkin/ajv).
The Feathers common hook
[`validateSchema`](../../api/hooks-common#validateSchema.md)
uses `ajv` to validate data.
:::

:::tip
We are not certifying the utilities and websites mentioned below work flawlessly.
They are part of the JSON-schema ecosystem and may prove useful.
We welcome your feedback on them.
:::

### $ref: Modularizing definitions

The field `createdAt` may be used in several schemas.
It would be advantageous to define its characteristics
-- such as its minLength and maxLength --
in one place rather than everywhere its used.

We can do this with the `$ref` keyword.
```json
// src/services/comment/comment.schema.js refers to an external property definition
{
  properties: {
    // ...
    createdAt: { $ref: 'common.json#/definitions/created_at'}
  }
}

// src/refs/common.json contains the definition
{
  "description": "Common JSON-schema definitions.",
  "definitions": {
    "created_at": {
      "description": "Creation date-time.",
      "example": "2018-01-01T01:01:01.001Z",
      "format": "date-time",
      "readOnly": true,
      "type": "string"
    },
  }
}

// src/services/comment/comment.validate.js will be generated with
const base = merge({},
  {
    properties: {
      createdAt: {
        description: "Creation date-time.",
        example: "2018-01-01T01:01:01.001Z",
        format: "date-time",
        readOnly: true,
        type: "string"
      }
    }
  },
);

// src/services/comment/comment.mongoose.js will be generated with
{
  createdAt: String
},
```

The definition of `createdAt` in common.json will be merged into the field in comment.schema.js.

You can create a $ref file like common.json with all the common elements in your app.
Should the need arise to change some, such as increasing the length of the `address` field,
you need change it in only one place, and then regenerate the project.

You can read about additional features of $ref in the
[JSON-schema tutorial](https://code.tutsplus.com/tutorials/validating-data-with-json-schema-part-2--cms-25640).


### Summary

The [online JSON-schema editor](https://jsonschema.net)
provides an easy introduction to JSON-schema,
as well as a useful generator of simple JSON-schema.

You will have to read the
[tutorial](https://code.tutsplus.com/tutorials/validating-data-with-json-schema-part-1--cms-25343)
sooner or later to understand how to add validation criteria.

There are also ways to generate your JSON-schema from your data,
and from existing database schemas.

Finally you can decide to check your JSON-schema against your existing data.


## GraphQL

You are asked `Should this be served by GraphQL?` when you (re)generate a service.
This identifies which services you want included in the GraphQL endpoint.

### GraphQL extension

Additional information is required for each included service,
and this is provided in the schema with `extensions.graphql`.
```js
// cli-generator-example/src/services/comment/comment.schema.js
let schema = {
  // ...
  properties: {
    id: { type: 'ID' },
    _id: { type: 'ID' },
    uuid: { type: 'ID' },
    authorUuid: { type: 'ID' },
    postUuid: { type: 'ID' },
    body: {},
    archived: { type: 'integer' }
  },
};

let extensions = {
  graphql: {
    name: 'Comment',
    service: { sort: { uuid: 1 } },
    sql: {
      sqlTable: 'Comments',
      uniqueKey: 'uuid',
      sqlColumn: {
        authorUuid: 'author_uuid',
        postUuid: 'post_uuid',
      },
    },
    discard: [],
    add: {
      author: { type: 'User!', args: false, relation: { ourTable: 'authorUuid', otherTable: 'uuid' } },
      likes: { type: '[Like!]', args: false, relation: { ourTable: 'uuid', otherTable: 'commentUuid' }  },
    },
  },
};

// Allows GraphQL queries like
{
  getComment(key: 10) {
    uuid
    authorUuid
    postUuid
    body
    archived
    author {
      fullName
    }
    likes {
      author {
        fullName
      }
      comment {
        body
      }
    }
  }
}

// with results like
{
  "getComment": {
    "uuid": "10",
    "authorUuid": "0",
    "postUuid": "90",
    "body": "Comment 1",
    "archived": 0,
    "author": {
      "fullName": "John Szwaronek",
    },
    "likes": [
      {
        "author": {
          "fullName": "Jessica Szwaronek",
        },
        "comment": {
          "body": "Comment 1",
        }
      },
      // ...
    ]
  }
}
```

- `name` - The name of the GraphQL type for this service.
It defaults to the singular name you provided for the service, with the first letter capitalized.
- `service` - This is required if you want to generate GraphQL resolvers using Feathers service,
alone or with BatchLoaders.
  - `sort` - The sort criteria used when this service is the top level of a GraphQL Query.
- `sql` - This is required if you want to generate GraphQL resolvers which use raw SQL statements.
  - `sqlTable`: The name of the SQL table in the database.
  - `uniqueKey`: The name of the column containing the unique key for records in the table.
  - `sqlColumn`: A hash containing the map of field names in comment.schema.js to column names in the SQL table.
- `discard`: Field names to exclude from GraphQL queries.
- `add`: Relations between this service and other services.
  - property name, e.g. `author`: The name of the GraphQL type for this resolver. 
  - `type`: The GraphQL type the resolver will return, along with its cardinality.
    - `User`    - a User type or `null`.
    - `User!`   - a User type. `null` is not allowed.
    - `[User]`  - an array of User types, some of which may be null.
    - `[User!]` - an array of User types.  
  - `type`: It may also be GraphQL scalar type such as `String`.
  In this case its assumed to be a calculated field.
  You will customize the calculation by modifying its resolver in, say,
  graphql/service.resolvers.js.  
  - `args`: Resolvers may optionally have parameters, for example
  `getComment` above has `key`, while `author` and `likes` have none.
  A value of `false` eliminates parameters, while `true` or `undefined` allows them.
  The parameters are the same as the Feathers service API:
    - `key`: The same as the Feathers service `id` as used in `name.get(id)`.
    - `query`: The same as the Feathers service query, e.g. `name.find({ query: query })`.
    - `params`: The same as the Feathers service params, e.g. `name.find(params)`.
    The `query` param will be merged into any `params` param.  
```js
{
  getUser(key: 1) {
    uuid
    firstName
    lastName
    fullName
    email
    posts(query: {draft: 0}) {
      uuid
      authorUuid
      body
      draft
    }
```       
  - `relation`: How the tables relate to one another.
    - `ourTable`: The field in our schema which matches to the `type` schema.
    - `otherTable`: The field in the `type` schema which matches the field in our schema.
    
### Generating the GraphQL endpoint

You generate the GraphQL service by running `feathers-plus generate graphql`.
This generates the `graphql` Feathers service.
The prompts allow you to choose the name of the endpoint.

These modules are always created:
- `graphgl/service.resolvers.js`: Resolvers using Feathers services alone.
- `graphgl/batchloader.resolvers.js`: Resolvers using Feathers services and BatchLoaders.
- Several modules are created for resolvers using raw SQL statements.
  - `graphql/sql.metadata.js`: Additional information required to form the raw SQL statements.
  [join-monster](https://join-monster.readthedocs.io/en/latest/) is used for this,
  and you definitely need to understand its documentation.
  - `graphql/sql.resolvers.js`: Resolvers which call join-monster routines.
  - `graphql/sql.execute.js`: You will have to modify this module.
  It defaults to using a Sequelize instance.

You are asked which type of resolvers you want to use when generating the endpoint.
You can choose any for which your schemas have the required information.
You can change the the resolvers used by regenerating the endpoint.

### Generated queries

GraphQL, in our opinion, is great for queries.
However we feel Feathers is cleaner and easier for mutations and subscriptions.

Two GraphQL CRUD queries are generated for each service.
They would be `getComment` and `findComment` for the `comment`.
- `getComment` requires the `key` parameter. The `params` one is optional.
- `findComment` would usually include a `query` parameter. The `params` one is optional.

You call the queries using `app.service('graphql').find({ query: { query: graphalQueryStr } })`,
where `graphalQueryStr` is a GraphQL query **string** such as
```js
'{
   getUser(key: 1) {
     uuid
     firstName
     lastName
     fullName
     email
     posts(query: {draft: 0}) {
       uuid
       authorUuid
       body
       draft
     }
   }
}'
```

:::tip
The `{ query: { query: graphalQueryStr } }` syntax is compatible with tools such as GraphiQL.
:::

`$` is a reserved character in GraphQL.
So Feathers reserved words like $in, $sort, $skip, etc. cannot be used.
You can instead replace the `$` with a double underscore `__` and use
__in, __sort, __skip, etc. instead.

### Calls to Feathers services

:::tip
The following does not apply to BatchLoaders.
:::

The `key` argument is used for Feathers' `id`.

The `query` and `params` arguments are merged for the Feathers `params` argument.
`graphql: <Array>` is added to `params` to indicate the service call is part of a GraphQL query.
Its contents are described in the following section.

The returned result is Feathers compatible.
It will contain pagination information if the top level service is configured for pagination.

You will have to programmatically paginate services other than the top level one,
using __skip and __limit.

### Resolver paths

Let's use this as an example:
```js
'{
   findUser(query: {uuid: {__lt: 100000}}) {
     fullName
     posts(query: {draft: 0}) {
       body
       comments {
         body
       }
     }
   }
}'
```

We can analyze the AST of the Query string to produce a "resolver path" to identify when and why a resolver
is being called.
In the above example, the findUser resolver would produce a resolver path of
```json
[ 'findUser', '[User]!' ]
```

This 2-tuple means the resolver was called for the `findUser` GraphQL type,
and its expected to return a `[User]!` result.

Let's say findUser returned with 4 records.
We have to populate the posts for each, and each of the 4 populates would call the `posts` resolver.
This would result in the paths
```json
[ 'findUser', 0, 'User', 'posts', '[Post!]' ]
[ 'findUser', 1, 'User', 'posts', '[Post!]' ]
[ 'findUser', 2, 'User', 'posts', '[Post!]' ]
[ 'findUser', 3, 'User', 'posts', '[Post!]' ]
```

The 3-tuple `'findUser', n, 'User'` means the n-th record of the findUser result
(all of which are User GraphQL types)
followed by 2-tuple `'posts', '[Post!]'` which means that n-th record was populated by the post resolver,
resulting in a `[Post!]` result.

Now each of those posts has to be populated by their comments.
Let's say the first user had 2 posts, its resulting resolver paths would be
```json
[ 'findUser', 0, 'User', 'posts', 0, '[Post!]', 'comments', '[Comment!]' ]
[ 'findUser', 0, 'User', 'posts', 1, '[Post!]', 'comments', '[Comment!]' ]
```
and the other user records would have their own resultant paths.

In sum, these resolver paths would be produced
```json
[ 'findUser', '[User]!' ]
[ 'findUser', 0, 'User', 'posts', '[Post!]' ]
[ 'findUser', 0, 'User', 'posts', 0, '[Post!]', 'comments', '[Comment!]' ]
[ 'findUser', 0, 'User', 'posts', 1, '[Post!]', 'comments', '[Comment!]' ]
[ 'findUser', 1, 'User', 'posts', '[Post!]' ]
// ...
[ 'findUser', 2, 'User', 'posts', '[Post!]' ]
// ...
[ 'findUser', 3, 'User', 'posts', '[Post!]' ]
// ...
```

### Provide resolver path to service hooks

Feathers service hooks can reference `context.params.graphql = resolverPath }`
so that the hook has more information about the GraphQL call.

### Authentication

If the GraphQL endpoint is generated as requiring authentication,
then its resulting `context.user`, `context.authenticated`
are passed along to the resolver calls.

:::tip
`context.provider` is always passed along.
:::

You may have other props passed along as well by customizing src/services/graphql/service.resolvers.js
and batchloader.resolvers.js.
For example
```js
// !<DEFAULT> code: extra_auth_props
const convertArgs = convertArgsToFeathers(['extraPropName1', 'extraPropName2']);
// !end
```

### Pagination

Pagination is respected for the top-level service in the Query.
It is ignored by default for services at a lower level in the query.

The maximum number of keys retrieved by a BatchLoader defaults to the pagination size,
and you can customize it.
```js
// !<DEFAULT> code: max-batch-size
let defaultPaginate = app.get('paginate');
let maxBatchSize = defaultPaginate && typeof defaultPaginate.max === 'number' ?
  defaultPaginate.max : undefined;
// !end
```


## GraphQL example

:::tip
@feathers-plus/cli-generator-example: Example Feathers app using the @feathers-plus/cli generator and the @feathers-plus/graphql adapter to expose a GraphQL endpoint.
:::

### Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/cli-generator-example
    npm install
    ```

3. `cli-generator-example` starts a server listening to port 3030.
Check that public/serverUrl.js will point to this server.

4. Start your app

    ```
    npm start
    ```

The app will create the database
and then run a short async test to confirm it is functioning correctly.

### Starting the client test harness

Point your browser at `localhost:3030` and you will see this test harness:

![test harness](../assets/test-harness.jpg)

The client will authenticate with the server before enabling the `Run query` button.

You can run any of the 10 provided queries.
The query appears in the editable window on top
and you can modify any of those queries before running them.

The result (or error message) appears in the bottom window after you click `Run query`.

The examples show that GraphQL keywords are allowed in some of the resolvers.
These keywords are similar to those used with FeathersJS services.
- key: The same as FeathersJS `id`, a numeric or string.
- query: The same as FeathersJS `params.query`.
- params: The same as FeathersJS `params`.

`$` is a reserved character in GraphQL, so Feathers props such as `$sort` and `$in`
would result in GraphQL errors.
You can instead use a double underscore (`__`) where ever you would use a `$` with FeathersJS. 

### Using Graphiql

To do. Basically Graphiql will just work.

### Database

This app can use either an NeDB or SQLite database, both of which reside in `./data`.

Both databases have the same structure:

![database stucture](../assets/schema.jpg)

and contain the same data:

![database data](../assets/tables.jpg)

`uuid` fields are used as foreign keys for table relations
so as to avoid differences between `id` and `_id` in different databases.

### What type of resolvers are being used?

The repo on Github is (usually) configured to use Feathers service calls alone.
You can reconfigure it to use either Feathers service calls with
[BatchLoaders](https://feathers-plus.github.io/v1/batch-loader/guide.html)
or with raw SQL statements by running @feathers-plus/cli's `generate graphql` command.

Switching the resolvers being used like this is an interesting example of
the advantages of round-trip regeneration.