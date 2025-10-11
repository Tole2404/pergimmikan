const Joi = require('joi');

exports.validateEvent = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(255),
    description: Joi.string().required(),
    event_date: Joi.date().required(),
    event_time: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    location: Joi.string().required(),
    max_participants: Joi.number().integer().min(1).required(),
    registration_deadline: Joi.date().required(),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').default('upcoming')
  });

  return schema.validate(data);
};
