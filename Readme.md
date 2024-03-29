# LeadConduit Types

This Node.JS module parses lead data by type.

[![Build Status](https://github.com/activeprospect/leadconduit-types/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/activeprospect/leadconduit-types/actions)

### Usage

```javascript
var types = require('leadconduit-types');
var phone = types.phone.parse('(512) 789-1111');
console.log(phone);
```

### Supported types

In LeadConduit each field has an associated type, which is used to help make sense out of submitted lead data. The following table summarizes all supported types and provides some example values for each.


| Data Type       | Description                                                                                                                                                                                                | Examples                                                                                            |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| string          | Any string data which can include alphanumeric characters, whitespace, special characters, new lines, etc.                                                                                                 | <sub>`John`, `I would like some information on your product`, `0123`</sub>                          |
| number          | Any string which can be parsed to a number                                                                                                                                                                 | <sub>`1000`, `9,998.99`</sub>                                                                        |                                                                    |
| boolean         | Any string wich can be parsed to a boolean                                                                                                                                                                 | <sub>`true`, `1`, `yes`</sub>                                                                       |
| date, dob       | Most strings which are reasonably recognizable as a date, including European formats (month before day)                                                                                                    | <sub>`1995-12-25` (recommended), `Dec 25, 1995`, `12/25/1995`, `25/12/1995`</sub>                   |
| time            | Most strings which are reasonably recognizable as a datetime, including European formats (month before day)                                                                                                | <sub>`2014-06-14T18:27:33.000Z` (recommended), `2014-06-14T18:27:33Z`, `06/14/2014 6:27:33 PM`, `Sat Jun 14 2014 13:27:33 GMT-0500 (CDT)`</sub>                   |
| ssn             | A US Social Security Number. Data submitted in this field transient. It is never stored or logged by LeadConduit.                                                                                          | <sub>`123-45-6789`, `123 45 6789`, `123456789`</sub>                                                |
| postal code     | A US, UK, or Canadian postal code                                                                                                                                                                          | <sub>`78751`, `78751-4424`, `AA11A 1AA`</sub>                                                       |
| state           | A US State abbreviation, or international locality                                                                                                                                                         | <sub>`TX`, `Quebec`</sub>                                                                           |
| range           | A numeric range, with a high and low boundary. A non-range is also acceptable provided is a number                                                                                                         | <sub>`1 to 10`, `1-10`, `10+`, `10`</sub>                                                           |
| gender          | Gender of the consumer                                                                                                                                                                                     | <sub>`Male`, `Female`, `Other`, `M`, `F`, `O`</sub>                                                 |
| phone           | A US phone number in a common format (optional extension must be preceded by the x character). To specify the type of the phone number append `h` for home, `w` for work, or `m` for mobile to the number. | <sub>`1-512-789-1111`, `512-789-1111 x1234`, `(512) 789-1111h`, `5127891111m`, `(512) 789-1111w`</sub> |
| email           | An email address                                                                                                                                                                                           | <sub>`foo@bar.com`, `foo+bar@baz.com`</sub>                                                         |
| street          | A street address                                                                                                                                                                                           | <sub>`4203 Guadalupe St`</sub>                                                                      |
| trustedform_url | A TrustedForm certificate or ping URL                                                                                                                                                                      | <sub>`https://cert.trustedform.com/eb9fc4dd9bed9ad451a5648946cf4bf09b5bb947`</sub>                                       |
| url             | A URL                                                                                                                                                                                                      | <sub>`https://mywebsite.com`</sub>                                                                  |

