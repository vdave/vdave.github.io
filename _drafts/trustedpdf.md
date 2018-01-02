---
title: Trusted PDF
layout: post
tags: [pdf, trust, signing]
category: Information
---

Can you trust a PDF? How to checksum a PDF, store the checksum in the PDF metadata, and still verify integrity of the PDF though the checksum.

<!--break-->

## Option A: Placeholder

1. Add a string of the same size and structure as the checksum string, but replace the value with all zeroes (or any other known value), a zero-checksum.
2. Compute the checksum and write the value over the zero-checksum.
3. To verify, get the checksum and overwrite with the zero-checksum value and compute the resulting checksum.

The problem with this approach is that other metadata elements of the file may be altered when adjusting the value of the checksum.

## Opton B: Transformed Document

Transform the document by extractng text and key metadata, whatever needs to be guaranted consistent across copies, and compute the checksum on that. Perhaps stash the algorithm with the document to ensure reliable computation. Algorithm would need to be signed as well.
