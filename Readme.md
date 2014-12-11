# LeadConduit Types

This Node.JS module parses lead data by type.

[![Build Status](https://travis-ci.org/activeprospect/leadconduit-types.svg?branch=0.2.x)](https://travis-ci.org/activeprospect/leadconduit-types)

## Usage

```javascript
var types = require('leadconduit-types');
var phone = types.phone.parse('(512) 789-1111');
console.log(phone);
```
