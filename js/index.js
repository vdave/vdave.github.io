
var FLICKR_URL="https://api.flickr.com/services/rest/";
var PHOTOSETS = {};

// A dictionary of lists. This is used to track outstanding asynchronous
// tasks that need to be completed before rendering a portion of the
// UI composed of several pieces.
var WORK={};

/*
Return a list of elements that occur in both arr1 and arr2
*/
function arrayDiff(arr1, arr2) {
  var ret = [];
  for(var i in arr1) {   
    if(arr2.indexOf(arr1[i]) > -1){
      ret.push(arr1[i]);
    }
  }
  return ret;
};

/*
Given tests, an array of regular expressions, return True if any of arr
match a test.
*/
function arrayMatch(arr, tests) {
  var i, j;
  for (i=0;i<tests.length; i++) {
    var test = RegExp(tests[i],'g');
    for (j=0;j<arr.length;j++) {
      var v = arr[j];
      if (v.search(test) >= 0) {
        return true;
      }
    }
  }
  return false;
}

function vOrDefault(v, default_v) {
  if (typeof v == 'undefined') {
    return default_v;
  }
  if (v == undefined) {
    return default_v;
  }
  if (v === null) {
    return default_v;
  }
  return v;
}

/*
Creates a new set of asynchronous tasks tied to a specific name. 

Tasks are added to a stack for a specific name and completed in order
of addition to the stack.
*/
function createJob(name, callback, params) {
  /*
   Create a new tracker for a set of asynchronous tasks
   name: name of the tracker
   callback: method called when task list becomes empty
   params: parameters to send to callback
  */
  WORK[name] = {
    onDone: callback,
    params: params,
    counter: []
  };
}


function pushJob(name) {
  /*
    Add a job to the task list.

    name: name of the task list
  */
  WORK[name].counter.push(1);
}


function popJob(name) {
  /*
    Decrement tracked tasks and callback if empty.

    name: name of the task list
  */
  WORK[name].counter.pop();
  if (WORK[name].counter.length == 0) {
    WORK[name].onDone(WORK[name].params);
  }
}


/* 
Returns an identifier for a photoset that is a combination of the name and
tags.
*/
function getPhotosetId(photoset_name, tags_to_match) {
  tags_to_match = vOrDefault(tags_to_match, []);
  return photoset_name + "_" + tags_to_match.join("-");
}


/*

api_key: Flickr API key
user_id: User id of account to access
photoset_name: The name of the album on Flickr
tags_to_match: List of tags that identify images to be shown in this rendering
*/
function loadPhotosetId(target_id) {
  //var photoset_id = getPhotosetId(photoset_name, tags_to_match);
  pushJob(target_id);
  $.ajax({
    url: FLICKR_URL,
    datatype: "json",
    data: {
      method: "flickr.photosets.getList",
      api_key: WORK[target_id].params.api_key,
      user_id: WORK[target_id].params.user_id,
      format: "json",
      nojsoncallback:1
    },
    success: function(response) {
      //alert("Response:" + response);
      //console.log(response);
      for (idx in response.photosets.photoset) {
        var pset = response.photosets.photoset[idx];
        if (pset.title._content == WORK[target_id].params.photoset_name) {
          PHOTOSETS[target_id] = {
            id: pset.id,
            description: pset.description._content,
            photos: {},
            photo_order: []
          }
        }
      }
      loadPhotos(target_id);
      popJob(target_id);
    }
  });
}


function loadPhotos(target_id) {
  //var photoset_id = getPhotosetId(photoset_name, tags_to_match);
  pushJob(target_id);
  $.ajax({
    url: FLICKR_URL,
    datatype: "json",
    data: {
      method: "flickr.photosets.getPhotos",
      api_key: WORK[target_id].params.api_key,
      user_id: WORK[target_id].params.user_id,
      photoset_id: PHOTOSETS[target_id].id,
      extras: 'tags',
      format: "json",
      nojsoncallback:1
    },
    success: function(response) {
      for (idx in response.photoset.photo) {
        var photo_inf = response.photoset.photo[idx];
        var photo_tags = photo_inf.tags.split(",");
        //var matching_tags = arrayDiff(WORK[target_id].params.tags_to_match, photo_tags);
        if (arrayMatch(photo_tags, WORK[target_id].params.tags_to_match)) {
          var photo = {
            id: photo_inf.id,
            title: photo_inf.title,
            small: "",
            large: "",
            download: "",
          }
          PHOTOSETS[target_id].photos[photo.id] = photo;
          PHOTOSETS[target_id].photo_order.push(photo.id);
          loadPhotoSizes(target_id, photo.id);
        }
      }      
    popJob(target_id);
    }
  });
}


function loadPhotoSizes(target_id, photo_id) {
  pushJob(target_id);
  $.ajax({
    url: FLICKR_URL,
    datatype: "json",
    data: {
      method: "flickr.photos.getSizes",
      api_key: WORK[target_id].params.api_key,
      photo_id: photo_id,
      format: "json",
      nojsoncallback:1
    },
    success: function(response) {
      for (idx in response.sizes.size) {
        var psize = response.sizes.size[idx];
        if (psize.label == "Medium") {
          PHOTOSETS[target_id].photos[photo_id].small = psize.source;  
        } else if (psize.label == "Large 2048") {
          PHOTOSETS[target_id].photos[photo_id].large = psize.source;  
        } else if (psize.label == "Original") {
          PHOTOSETS[target_id].photos[photo_id].download = psize.source;  
        }        
      }
      popJob(target_id);
    }
  });
}


function injectGallery(params) {
  //console.log(PHOTOSETS[params.photoset_name]);
  var gallery_id = params.target_id + '-gallery';
  var tdiv = $('<div>', {'id':gallery_id, 'class':'list-unstyled'});
  var pset = PHOTOSETS[params.target_id];
  for (idx in pset.photo_order) {
    var photo = pset.photos[pset.photo_order[idx]];
    var aele = $("<a>", {'class':'', 'href': photo.large, 'data-sub-html': photo.title, 'data-download-url':photo.download});
    var img = $("<img>", {'class':'img-responsive', 'src': photo.small});
    aele.append(img);
    img = $("<img>", {'src':'https://sachinchoolur.github.io/lightGallery/static/img/zoom.png'});
    aele.append($("<div>", {class:'demo-gallery-poster'}).append(img));
    tdiv.append(aele);
  }
  $("#" + params.target_id).empty();
  $("#" + params.target_id).append(tdiv);
  tdiv.justifiedGallery({
    border: 6,
    rowHeight: 200
  }).on("jg.complete", function() {
    tdiv.lightGallery({
      pager: false,
      hideBarsDelay: 5000,
      thumbnail: true,
      showThumbByDefault: false
    });
  });
}


function loadGallery(target_id) {
  var target_ele = $("#"+target_id);
  var api_key = target_ele.attr("api-key");
  var user_id = target_ele.attr("gallery-user");
  var photoset_name = target_ele.attr("gallery-name");
  var tags_to_match = vOrDefault(target_ele.attr("tags"),'.*').split(",");
  console.log("API-KEY=" + api_key);
  var params = {
    api_key: api_key,
    user_id: user_id,
    photoset_name: photoset_name,
    tags_to_match: tags_to_match,
    target_id: target_id
  };
  createJob(target_id, injectGallery, params);
  loadPhotosetId(target_id);
}


$(document).ready(function() {
  //TODO: Load this by finding class
  $(".demo-gallery").each( function() {
    var gallery_id = $( this ).attr('id');
    loadGallery(gallery_id);
  }); 
  //loadGallery("gallery01");
  //loadGallery("gallery02");
});