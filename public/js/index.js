
var FLICKR_URL="https://api.flickr.com/services/rest/";
var PHOTOSETS = {};

// A dictionary of lists. This is used to track outstanding asynchronous
// tasks that need to be completed before rendering a portion of the
// UI composed of several pieces.
var WORK={};

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


function loadPhotosetId(api_key, user_id, photoset_name) {
  pushJob(photoset_name);
  $.ajax({
    url: FLICKR_URL,
    datatype: "json",
    data: {
      method: "flickr.photosets.getList",
      api_key: api_key,
      user_id: user_id,
      format: "json",
      nojsoncallback:1
    },
    success: function(response) {
      //alert("Response:" + response);
      //console.log(response);
      for (idx in response.photosets.photoset) {
        var pset = response.photosets.photoset[idx];
        if (pset.title._content == photoset_name) {
          PHOTOSETS[photoset_name] = {
            id: pset.id,
            description: pset.description._content,
            photos: {},
            photo_order: []
          }
        }
      }
      loadPhotos(api_key, user_id, photoset_name);
      popJob(photoset_name);
    }
  });
}


function loadPhotos(api_key, user_id, photoset_name) {
  pushJob(photoset_name);
  $.ajax({
    url: FLICKR_URL,
    datatype: "json",
    data: {
      method: "flickr.photosets.getPhotos",
      api_key: api_key,
      user_id: user_id,
      photoset_id: PHOTOSETS[photoset_name].id,
      format: "json",
      nojsoncallback:1
    },
    success: function(response) {
      for (idx in response.photoset.photo) {
        var photo_inf = response.photoset.photo[idx];
        var photo = {
          id: photo_inf.id,
          title: photo_inf.title,
          small: "",
          large: "",
          download: "",
        }
        PHOTOSETS[photoset_name].photos[photo.id] = photo;
        PHOTOSETS[photoset_name].photo_order.push(photo.id);
        loadPhotoSizes(api_key, photoset_name, photo.id);
      }      
    popJob(photoset_name);
    }
  });
}


function loadPhotoSizes(api_key, photoset_name, photo_id) {
  pushJob(photoset_name);
  $.ajax({
    url: FLICKR_URL,
    datatype: "json",
    data: {
      method: "flickr.photos.getSizes",
      api_key: api_key,
      photo_id: photo_id,
      format: "json",
      nojsoncallback:1
    },
    success: function(response) {
      for (idx in response.sizes.size) {
        var psize = response.sizes.size[idx];
        if (psize.label == "Medium") {
          PHOTOSETS[photoset_name].photos[photo_id].small = psize.source;  
        } else if (psize.label == "Large 1600") {
          PHOTOSETS[photoset_name].photos[photo_id].large = psize.source;  
        } else if (psize.label == "Original") {
          PHOTOSETS[photoset_name].photos[photo_id].download = psize.source;  
        }        
      }
      popJob(photoset_name);
    }
  });
}


function injectGallery(params) {
  //console.log(PHOTOSETS[params.photoset_name]);
  var gallery_id = params.target_id + '-gallery';
  var tdiv = $('<div>', {'id':gallery_id, 'class':'list-unstyled'});
  var pset = PHOTOSETS[params.photoset_name];
  for (idx in pset.photo_order) {
    var photo = pset.photos[pset.photo_order[idx]];
    var aele = $("<a>", {'class':'', 'href': photo.large, 'data-sub-html': photo.title, 'data-download-url':photo.download});
    var img = $("<img>", {'class':'img-responsive', 'src': photo.small});
    aele.append(img);
    img = $("<img>", {'src':'https://sachinchoolur.github.io/lightGallery/static/img/zoom.png'});
    aele.append($("<div>", {class:'demo-gallery-poster'}).append(img));
    tdiv.append(aele);
  }
  $("#" + params.target_id).append(tdiv);
  tdiv.justifiedGallery({
    border: 6
  }).on("jg.complete", function() {
    tdiv.lightGallery({
      pager: false,
      hideBarsDelay: 5000,
      thumbnail: true,
      showThumbByDefault: false,
    });
  });
}


function loadGallery(target_id) {
  var target_ele = $("#"+target_id);
  var api_key = target_ele.attr("api-key");
  var user_id = target_ele.attr("gallery-user");
  var photoset_name = target_ele.attr("gallery-name");
  console.log("API-KEY=" + api_key);
  var params = {
    photoset_name: photoset_name,
    target_id: target_id
  };
  createJob(photoset_name, injectGallery, params);
  loadPhotosetId(api_key, user_id, photoset_name, injectGallery);
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