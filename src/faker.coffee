faker = require 'faker'
defaultLocale = 'en_US'
previousLocale = null

forLocale = (locale, fxn, args...) ->
  faker.locale = defaultLocale
  faker.locale = locale if faker.locales[locale]
  try
    fxn.apply(fxn, args)
  finally
    faker.locale = defaultLocale


module.exports =
  firstName: (locale) ->
    forLocale locale, faker.name.firstName.bind(faker.name)

  lastName: (locale) ->
    forLocale locale, faker.name.lastName.bind(faker.name)

  email: (firstName, lastName, locale) ->
    forLocale locale, faker.internet.email.bind(faker.internet), firstName, lastName

  city: (locale) ->
    forLocale locale, faker.address.city.bind(faker.address)

  state: (locale) ->
    forLocale locale, faker.address.state.bind(faker.address)

  stateAbbr: (locale) ->
    forLocale locale, faker.address.stateAbbr.bind(faker.address)

  postalCode: (locale) ->
    forLocale locale, faker.address.zipCode.bind(faker.address)

  phone: (locale) ->
    forLocale locale, faker.phone.phoneNumber.bind(faker.phone)

  password: (locale) ->
    forLocale locale, faker.internet.password.bind(faker.internet)

  url: (locale) ->
    forLocale locale, faker.internet.url.bind(faker.internet)

