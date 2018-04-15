---
layout: post
mathjax: true
title: "Where am I?"
summary: "Lost in cyberspace."
date: "2007-05-18"
categories: ["Travel"]
tags: [travel, python, georeference]
---


```python
from urllib import urlopen, urlencode
import simplejson

def whereami(address):
  key = "the big long key from www.google.com/apis/maps/signup.html"
  url = "http://maps.google.com/maps/geo?%s&amp;output=json&amp;key=%s" \
  % (urlencode({"q":address}), key, )
  jres = urlopen(url).read()
  res = simplejson.loads(jres)
  return res


print whereami("1 Jackass Hill Rd, Littleton, CO, USA")\
           ['Placemark'][0]['Point']['coordinates']

print whereami("Queenstown, New Zealand")['Placemark'][0]\
           ['Point']['coordinates']


[-105.019306, 39.579701999999997, 0]
[168.66273100000001, -45.031103999999999, 0]
```