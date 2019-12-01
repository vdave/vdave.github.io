---
layout: full-width
title: Notes
# Note that this index page uses a full-width layout!
weight: 2
---

  <!-- <h1 class="content-listing-header sans">Notes</h1> -->
  <ul class="content-listing ">
    {% for post in site.posts %}      
        <li class="listing">
          <a href="{{ post.url | prepend: site.baseurl }}"><h2 class="larger">{{ post.title }}</h2></a>
          <span class="smaller">{{ post.date | date: "%B %-d, %Y" }}</span>
          <div>{{ post.excerpt }}</div>
        </li>
    {% endfor %}
  </ul>
