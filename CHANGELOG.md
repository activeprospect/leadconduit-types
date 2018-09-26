# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [4.17.0] - 2018-09-26
## Fixed
- Support European date formats (https://activeprospect.tpondemand.com/entity/4350-leadconduit-does-not-properly-parse-dates)
- Update dependencies to resolve security vulns

## [4.16.2] - 2018-02-16
## Fixed
- corrected state abbreviations (#108)

## [4.16.1] - 2018-01-01
## Fixed
- upgrade handlebars to ^4.0.0 (#105)

## [4.16.0] - 2017-10-16
## Added
- add support for free and disposable email validation

## [4.15.1] - 2017-07-31
## Fixed
- Use a more recent version of linphonenumber (#99)

## [4.15.0] - 2017-07-17
## Fixed
- include http protocol in parsing of url fields

## [4.14.2] - 2017-03-22
## Added
- added a few date-parsing formats

## [4.14.1] - 2017-03-15
## Added
- logging of when "strict" date-parsing fails

## [4.14.0] - 2017-01-23
## Added
- add Canada provinces to `state` type (fixes #87)
## Fixed
- retain `.valid` attribute on masked objects (fixes #56)

## [4.13.0] - 2017-01-17
## Added
- add 'matches pattern' operator where appropriate

## [4.12.0] - 2016-11-11
### Added
- add aggregations for boolean, number, range, and state

## [4.11.2] - 2016-10-25
### Fixed
- fix bug where 'array'-type data was being mistakenly parsed

## [4.11.1] - 2016-10-25
### Fixed
- change example text for strings to 'any text' (issue #47)

## [4.11.0] - 2016-10-19
### Added
- add `aggregate()` support for limiting data based on type

## [4.10.0] - 2016-09-12
### Added
- add "is not true" and "is not false" operators

## [4.9.0] - 2016-07-11
### Fixed
- Add support for negative range minimums (_only;_ not maximums), including dates prior to Jan. 1, 1970
- Add 'yes' and 'no' as boolean examples
- Add this changelog

## [0.3.0] - 2014-12-12
### Added
- Initial version
