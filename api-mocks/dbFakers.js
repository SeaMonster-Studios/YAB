module.exports = () => {
  const faker = require('faker')
  const _ = require('lodash')

  return {
    // <propertyTitle>: <[array of items]>
    people: _.times(5, n => ({
      id: n,
      email: 'logan@seamonsterstudios.com',
      password: 'password',
      avatar: faker.internet.avatar(),
    })),
  }
}
