---
layout: post
title: "OS X Comment"
date: "2016-10-10 12:45:45 -0500"
---

A tool to add comments to files on OS X in a way that contains both plain text and structured data. This is preferred over adding custom extended attributes as the spotlight comments have a better chance of being preserved with file transfers and synchronization tools like DropBox.

<!--break-->

The basic idea is to embed a JSON block within the comment, and to ensure the JSON block is preserved with edits to the comment text or JSON properties.

The script is available at [this gist](https://gist.github.com/datadavev/b6289c7edcd831b3ba75c6d11347e4ff).

~~~ plain
$ comment -h
usage: comment [-h] [-l] [-k] [-s SETVALUE] [--all] [-j] [-r]
               [--override_immutable]
               fname

Set by stdin or get finder comment for file.

positional arguments:
  fname                 The file to update or file to read from.

optional arguments:
  -h, --help            show this help message and exit
  -l, --log_level       Set logging level, multiples for more.
  -k, --keys            List the keys in the comment YAML section
  -s SETVALUE, --setvalue SETVALUE
                        Set a value, indicate as key:value or
                        JSON (with -j)
  --all                 Dump the entire comment including text and
                        JSON portions.
  -j, --json            Set or dump data section as JSON.
  -r, --replace         Replace JSON data rather than merge.
  --override_immutable  Force overwriting of immutable fields.
~~~

Some examples:

~~~ plaint
$ echo "This is some test comment" | comment test2.md

$ comment -s "id:test2" test2.md

$ comment -j test2.md
{
  "origin": "https://some.web.server/data",
  "id": "test2"
}

$ comment --all test2.md

This is some test comment
-----BEGIN JSON-----
{"origin": "https://some.web.server/data", "id": "test2"}
-----END JSON-----
~~~
