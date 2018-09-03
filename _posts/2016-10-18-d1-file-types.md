---
layout: post
title: "File Types"
categories: [DataONE]
tags: [types, files]
---

Looking into the file utility and having it detect file types. 

<!--more-->


On OS X, the various configuration files are located in  `/usr/share/file/magic`.[^1]


~~~ bash
$ file -b seasurf.nc
NetCDF Data Format data

$ file -b -I seasurf.nc
application/octet-stream; charset=binary
~~~

It would be nice to augment the `file` command to support the various [formats](https://cn.dataone.org/cn/v2/formats) used in DataONE.

For xml files, like various types of metadata, detection can use regular
expressions[^2] on namespaces. For example, part of the ``kml`` detection looks like:

~~~ plain
0 string    \<?xml
>20  search/400 \ xmlns=
>>&0 regex ['"]http://earth.google.com/kml Google KML document
!:mime application/vnd.google-earth.kml+xml
>>>&1 string 2.0' \b, version 2.0
>>>&1 string 2.1' \b, version 2.1
>>>&1 string 2.2' \b, version 2.2
~~~


[^1]: <https://linux.die.net/man/5/magic>
[^2]: <https://www.mkssoftware.com/docs/man4/magic.4.asp>
