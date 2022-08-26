exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.string('id').primary();
      table.string('user_name').notNullable();
      table.string('password').notNullable();
      table.string('email').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('trips', (table) => {
      table.string('id').primary();
      table.string('destination').notNullable();
      table.string('photo_reference').notNullable();
      table.string('start').notNullable();
      table.string('end').notNullable();
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table
        .string('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('tourist_attractions', (table) => {
      table.string('id').primary();
      table.float('rating').notNullable();
      table.integer('number_of_ratings').notNullable();
      table.string('place_name');
      table
        .string('trips_id')
        .notNullable()
        .references('id')
        .inTable('trips')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('restaurants', (table) => {
      table.string('id').primary();
      table.integer('rating').notNullable();
      table.integer('number_of_ratings').notNullable();
      table.string('restaurant_name');
      table
        .string('trips_id')
        .notNullable()
        .references('id')
        .inTable('trips')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('tourist_attractions')
    .dropTable('restaurants')
    .dropTable('trips')
    .dropTable('users');
};
