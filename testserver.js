//Require the Neo4J module
var neo4j = require('neo4j');

//Create a db object. We will using this object to work on the DB.
var db = new neo4j(
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'
);

//Run raw cypher with params
db.cypherQuery(

  'LOAD CSV FROM "file://' + __dirname + '/TEST2.csv" AS line MERGE(p:Player {name:line[0]}) MERGE(t:Team {name:line[2], year:line[1]})', function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      db.cypherQuery(

       'LOAD CSV FROM "file://' + __dirname + '/MasterDB.csv" AS line MATCH (p:Player), (t:Team) WHERE p.name = line[0] AND t.name = line[2] AND t.year = line[1] CREATE (p)-[r:PLAYS_IN]->(t)', function(err,result){
        if(err){
          console.log('there was an error running the query', err);
        } else if(result){
          console.log('Successfully Created Player and Team connections');
// EXTRACT(n in nodes(p) | n.name)'
          db.cypherQuery(
            'MATCH (p1:Player {name:"Russ Smith"}), (p2:Player {name:"Alex Len"}), p = shortestPath( (p1) - [*]-(p2)  ) RETURN EXTRACT(n in nodes(p) | n.name), EXTRACT(n in nodes(p) | n.year) ', function(err, p){
              if(err){
                console.log('error', err);
              } else{
                var data = p.data[0];


                console.log(p.data[0]);
                console.log('success');
              }
            });
        }
      });
      console.log('Successfully Create Player and Team nodes')

    }
  }

);
