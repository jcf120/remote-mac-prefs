const { exec } = require("child_process");
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    outputVolume: Int
    inputVolume: Int
    brightness: Float
  }

  type Mutation {
    setOutputVolume(val: Int!): Int
    setInputVolume(val: Int!): Int
    setBrightness(val: Float!): Float
  }
`;

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}

const resolvers = {
  Query: {
    outputVolume: () =>
      run("osascript -e 'set ovol to output volume of (get volume settings)'"),
    inputVolume: () =>
      run("osascript -e 'set ovol to input volume of (get volume settings)'"),
    brightness: async () => {
      const res = await run("brightness -l");
      const words = res.split(" ");
      return words[words.length - 1];
    },
  },
  Mutation: {
    setOutputVolume: async (_, { val }) => {
      await run(`osascript -e 'set volume ${(val * 7) / 100}'`);
      return val;
    },
    setInputVolume: async (_, { val }) => {
      await run(`osascript -e 'set volume input volume ${val}'`);
      return val;
    },
    setBrightness: async (_, { val }) => {
      await run(`brightness ${val}`);
      return val;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
