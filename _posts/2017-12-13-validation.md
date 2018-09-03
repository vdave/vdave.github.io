---
layout: post
title: "Looking for Validation"
date: "2017-12-13 11:00:00 -0500"
categories: [xml, python]
tags: [xml, xmlschema, xmlcatalog, parsing, validation]
---

Validating XML against the cited schema makes sure that the XML is at least structured correctly, and helps ensure that consumers of the XML have some guarantees about what to expect.

<!--more-->

Validation can be done pragmatically with a couple of commonly available tools, typically coming down to a choice of `libxml2` for C and Python or `Xerces` for Java. The examples here are for the Python `lxml` library, which uses `libxml2` under the hood.

In a nutshell:

```python
import os
CATALOG=os.path.expanduser("~/xmlcatalogs/catalog.xml")

# Note: do this before importing lxml
os.environ["XML_CATALOG_FILES"]="file://" + CATALOG

from lxml import etree

xsd = "http://www.ngdc.noaa.gov/metadata/published/xsd/schema.xsd"
schema = etree.XMLSchema(file=xsd)

doc = etree.parse(open("samples/iso_01.xml","r"))
s.assertValid(doc)

invalid_doc = etree.parse(open("samples/iso_02_cn-invalid.xml","r"))
s.assertValid(invalid_doc)
---------------------------------------------------------------------------
DocumentInvalid                           Traceback (most recent call last)
<ipython-input-9-aaa63f2f66c4> in <module>()
----> 1 s.assertValid(invalid_doc)

src/lxml/etree.pyx in lxml.etree._Validator.assertValid (src/lxml/etree.c:194448)()

DocumentInvalid: Element '{http://www.isotc211.org/2005/gmd}CI_Address': This element is not expected. Expected is one of ( {http://www.isotc211.org/2005/gmd}characterSet, {http://www.isotc211.org/2005/gmd}parentIdentifier, {http://www.isotc211.org/2005/gmd}hierarchyLevel, {http://www.isotc211.org/2005/gmd}hierarchyLevelName, {http://www.isotc211.org/2005/gmd}contact )., line 7

```

The `XML_CATALOG_FILES` environment can also be set outside the app doing the validation.

Note that the call to `etree.XMLSchema()` does not honor the default practice of `lxml` for no network access, and will in fact retrieve any referenced schemas from the network if those URIs are not resolved in the catalog.
