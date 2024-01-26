const db = require("../../util/database");

function craeteQuery(page, limit, queries, deletedAtColumnName) {
  if (isNaN(parseInt(page))) {
    page = 1;
  }
  if (isNaN(parseInt(limit))) {
    limit = 10;
  }

  var from;
  var query = "";
  var andQuery = "";
  var orQuery = "";
  if (page == 1) {
    from = 0;
  } else {
    from = page * limit - limit;
  }

  for (var i = 0; i < queries.length; i++) {
    if (
      queries[i]?.value != null &&
      queries[i]?.value != "" &&
      (queries[i].key == "=" || queries[i].key == "!=")
    ) {
      if(andQuery == ""){
        andQuery = `${queries[i].column} ${queries[i].key} ${db.escape(queries[i].value)}`;
      }else{
        andQuery = ` ${andQuery} AND ${queries[i].column} ${queries[i].key} ${db.escape(queries[i].value)}`;
      }
    }

    if (
      queries[i]?.value != null &&
      queries[i]?.value != "" &&
      queries[i].key == "LIKE"
    ) {
      if(orQuery == ""){
        orQuery = `${queries[i].column} LIKE ${db.escape(`%${queries[i].value}%`)}`;
      }else{
        orQuery = ` ${orQuery} OR ${queries[i].column} LIKE ${db.escape(`%${queries[i].value}%`)}`;
      }
    }
  }

  query = `${andQuery != "" || orQuery != "" ? "WHERE " : ""}${andQuery == "" ? "" : `(${andQuery}) `}${andQuery != "" && orQuery != "" ? " AND " : ""}${orQuery == "" ? "" : ` (${orQuery})`}`;

  if (deletedAtColumnName != null) {
    if (query == "") {
      query = `WHERE ${deletedAtColumnName} IS NULL`;
    } else {
      query = `WHERE ${deletedAtColumnName} IS NULL AND (${query.replace(
        "WHERE",
        ""
      )})`;
    }
  }

  return { query: query, from: from, limit: limit };
}

function insert(tableName, data) {
  if (tableName == "" || data.length == 0) {
    return null;
  } else {
    var query = `INSERT INTO ${tableName} (`;
    for (var i = 0; i < data.length; i++) {
      query = `${query} ${data[i].column}`;
      if (i != data.length - 1) {
        query = ` ${query},`;
      }
    }
    query = `${query} ) VALUES (`;

    for (var i = 0; i < data.length; i++) {
      if (data[i].value == null) {
        query = `${query} NULL`;
      } else {
        if (data[i].escape === false) {
          query = `${query} ${data[i].value}`;
        } else {
          query = `${query} ${db.escape(data[i].value)}`;
        }
      }

      if (i != data.length - 1) {
        query = ` ${query},`;
      }
    }
    query = `${query} )`;

    return query;
  }
}

function update(tableName, condition, data, updateDeleted = true) {
  if (tableName == "" || data.length == 0) {
    return null;
  } else {
    var query = `UPDATE ${tableName} SET`;

    for (var i = 0; i < data.length; i++) {
      if (data[i].value != null && data[i].value != "undefiend") {
        query = `${query} ${data[i].column} = ${data[i].value == 'null_' ? "NULL" : db.escape(data[i].value)},`;
      }
    }

    if (query[query.length - 1] == ",") {
      query = query.slice(0, query.length - 1) + query.slice(query.length);
    }

    query = `${query} WHERE ${condition}${
      updateDeleted ? "" : " AND deleted_at IS NULL"
    }`;

    return query;
  }
}

module.exports = { craeteQuery, insert, update };
