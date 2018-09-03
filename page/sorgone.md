---
layout: page
title: Schema.org
subtitle: DataONE support for schema.org data publishing pattern
weight: 3
---

Sharing data is a process complicated by the diversity of dataset{%sidenote 'DS' 'Herein the term *dataset* refers to a conglomerate of discrete items that together form a scientifically meaningful package inclusive of descriptive metadata. The term *data set* refers to a set of data.'%} characteristics. Datasets may be composed of as few as one file of data or millions. Individual data files may be a few bytes through terabytes or larger. Metadata may be embedded within data files or as separate entities. Sharing this information between systems with no loss of information requires careful consideration of not only the individual components, but also the relationships between them.

Fundamentally, the problem can be broken into two parts: 1) ensuring a complete description of any component; and 2) ensuring that the relationships between components are fully communicated.

## Describing a dataset component
- discrete file or not?
- size, checksum
- type, MIME-type
- file name
- identifier

## Describing relationships between components

Given a bag of items: A, B, C, D, E, the relationships between the items may be indicated as: `A-B`, `C-D`, `E-A`, `E-C`. Such information indicates that there is a relationship between `A` and `B` for example, but there is no indication of what that relationship is. Perhaps `B` obsoletes `A`, or perhaps `B` is a part of `A`. Additional information is needed.



## How to share data

A dataset may be composed of multiple discrete components which may include 
data, metadata, and relationships between intra- and inter-dataset components. The following are requirements for sharing a dataset between Internet connected systems.

0. Each component of a dataset must be identified by a globally unique identifier that resolves to only that component.

    

1. Where an identifier resolves to an alternate rendering of a component (such as a landing page for human readability), the alternate rendering must include machine actionable information indicating the mechanism by which the actual bytes of the component may be accessed.

1. Each component of a dataset must be identified by a version specific globally unique persistent identifier (PID) that resolves to only that component.

2. A version of any component identified by a PID is immutable{% sidenote 'IM' 'Immutability is absolute meaning that a checksum computed from the component will never change. As a corollary, any change to a dataset component requires that the changed component is identified by a different PID.'%}.

3. A component identified by a PID must be directly retrievable through an Internet protocol.

4. Any component may be identified by a version agnostic globally unique series identifier (SID) that resolves to the latest version of a component.

5. The identifier of a dataset should resolve to a component that provides a list of components in the dataset{% sidenote 'IL' 'This makes it possible for a consumer to easily easily locate all the components of the dataset.'%}. 

    The identifier for a dataset may be a PID or a SID. Where a PID is used it always refers to exactly the same set of components, that is a checksum computed across all components of the dataset in the same order will always be the same. Where a SID is used to refer to a dataset, the SID resolves to the latest version of the dataset.

6. The dataset component list must include the PID, a URI where the component version may be resolved, the SID if present, a URI from which the SID identified item may be resolved, and a time stamp in absolute time{% sidenote 'TI' 'Time stamps must be complete and include timezone information' %} that indicates when access to the component became available. The component list may include a reference to another component list. Traversal of all component lists referenced within a dataset will identify all components within the dataset. Component lists may be self-referential or create circular references.

