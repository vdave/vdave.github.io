---
layout: post_photo
title: "Flick Pics"
categories: [Photography]
tags: [photography, Flickr, javascript]
---

Herein is described a workflow to accessing photographs stored in Flickr from an alternative gallery.

Advantage is that photo presentation can be highly customized without tadvertisements and other Yahoo impositions. Disadvantage is that any touching of the photos requires recapture of the URLs for those photos. 

<!--break-->

## Requirements

* Lightroom Classic CC
* Flickr Plugin from [regex.info/blog/lightroom-goodies/flickr](http://regex.info/blog/lightroom-goodies/flickr)

## Workflow

1. Take photos
2. Load into Lightroom, edit, etc
3. Create new "Flickr Publish Collection..."
4. Add photos to the new collection
5. Add a `div` element with attributes to the page
6. Publish page

## Example

### Christmas 2017

In the yaml prefix:

```
layout: post_photo
...
```

Then in the position where the gallery should be placed:

```
<div 
  id="gallery01" 
  class="demo-gallery" 
  api-key="c07eb5e2058aa72699f1475793770b24"
  gallery-user="79022296@N02"
  gallery-name="Christmas 2017">
</div>
```

The script will retrieve the gallery components from Flickr and inject them into the page when loaded in the browser:

<div 
  id="gallery03" 
  class="demo-gallery" 
  api-key="c07eb5e2058aa72699f1475793770b24"
  gallery-user="79022296@N02"
  gallery-name="Arboreal Abuse">
</div>

<div 
  id="gallery01" 
  class="demo-gallery" 
  api-key="c07eb5e2058aa72699f1475793770b24"
  gallery-user="79022296@N02"
  gallery-name="Christmas 2017">
</div>


Multiple galleries can be placed on a page:

<div 
  id="gallery02" 
  class="demo-gallery" 
  api-key="c07eb5e2058aa72699f1475793770b24"
  gallery-user="79022296@N02"
  gallery-name="TEST01">
</div>

---

