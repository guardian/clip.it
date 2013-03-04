define(['jquery', 'guardian_idToolkit'], function($, ID) {
  var apiUrl = 'http://gnm41092.int.gnl:9999/store/'
    , userID = ID.localUserData().id;

  function save(collection, data) {
    data.dateCreated = new Date();
    var url = getUrl(collection)
      , data = {
            GU_U: 'WyIyMzEwOTU5IiwiamdvcnJpZUBnbWFpbC5jb20iLCJqYW1lc2dvcnJpZSIsIjUzNCIsMTM3MDE1NjE3MDkyOV0.MC4CFQC84j8IfqSiCjR2VpHiUBRv2sMG3gIVAJolokpdQvQXEeF-7XnTI3pVaSGs', // ID.localUserData().rawResponse,
            method: 'post',
            body: JSON.stringify(data)
        };

    $.ajax(url, {
        dataType: 'jsonp',
        data: data,
    }).then(
      function(res) {
        console.log('success', res);
      },
      function(res) {
        console.log('fail', res);
      });
  }

  function get(collection) {
    console.log('GETTING');
    var url = getUrl(collection)
      , data = {
            GU_U: 'WyIyMzEwOTU5IiwiamdvcnJpZUBnbWFpbC5jb20iLCJqYW1lc2dvcnJpZSIsIjUzNCIsMTM3MDE1NjE3MDkyOV0.MC4CFQC84j8IfqSiCjR2VpHiUBRv2sMG3gIVAJolokpdQvQXEeF-7XnTI3pVaSGs' // ID.localUserData().rawResponse,
        };

      $.ajax(url, {
        dataType: 'jsonp',
        data: data
      }).then(function(res) {
        console.log('success', res);
      },
      function(res) {
        console.log('fail', res.getAllResponseHeaders());
      });
  }

  function getUrl(collection) {
    return apiUrl + collection + '/' + userID;
  }

  return {
    save: save,
    get: get
  }
});