---
title: Citation Metadata in PDFs
layout: post
---

The PDF file format supports rich metadata where information about and extracted from the text can be persisted.

<!--break-->

`exiftool` is a convenient tool for getting and setting metadata entries in a wide variety of file formats, including PDF.

The PDF tags supported by `exiftool` are listed at: [sno.phy.queensu.ca/~phil/exiftool/TagNames/PDF.html](https://sno.phy.queensu.ca/~phil/exiftool/TagNames/PDF.html).

## Citation Metadata

The goal of citation metadata entries is to include all the information that would appear in a citation manager. By storing such details in the PDF, it is easy to transport between different systems without loosing information.

|BibDesk Field  |Metadata Field |
|---------------|---------------|
| id            |  |


Creating unique identifiers for files that can be resolved to a specific files on a specific machine.

Protocol:

In accordance with GP § 4-203

```
fid://{resolver}/{id}
```

resolver = unique id of system where identifier was generated
id = unique part of id