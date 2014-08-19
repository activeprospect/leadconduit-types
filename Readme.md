# LeadConduit Types

This Node.JS module parses lead data by type.

[![Build Status](https://magnum.travis-ci.com/activeprospect/leadconduit-types.svg?token=482wC8iv8U56UifHfWLx&branch=0.2.x)](https://magnum.travis-ci.com/activeprospect/leadconduit-types)

## Usage

```javascript
var types = require('leadconduit-types');
var phone = types.phone.parse('(512) 789-1111');
console.log(phone);
```
