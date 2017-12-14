
const { cwd } = require('process');
const { join } = require('path');
<%- insertFragment('imports') %>
<%- insertFragment('init') %>

<%- insertFragment('main', [
  'let dialect, openDb, executeSql;',
  '// const sqlite = require(\'sqlite\')',
  '// let dialect = \'sqlite3\';',
  '',
  '// let openDb = () => {',
  '//   sqlite.open(join(cwd(), \'data\', \'sqlite3.db\'));',
  '//   return sqlite;',
  '// };',
  '',
  '// let executeSql = sql => sqlite.all(sql)',
  '//   .catch(err => {',
  '//     console.log(\'executeSql error=\', err.message);',
  '//     throw err;',
  '//   });',
]) %>

let moduleExports = {
  dialect,
  executeSql,
  openDb,
  <%- insertFragment('moduleExports') %>
};

<%- insertFragment('more') %>

<%- insertFragment('exports') %>
module.exports = moduleExports;

<%- insertFragment('funcs') %>
<%- insertFragment('end') %>