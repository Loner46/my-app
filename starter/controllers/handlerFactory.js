const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with typed ID!', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'The tour was successfully removed!',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!model) {
      return next(new AppError('No model found with typed ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: model,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newModel = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newModel,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const model = await query;

    if (!model) {
      return next(new AppError('No document found with typed ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: model,
      },
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    let query = Model.find(filter);
    if (popOptions) query = query.populate(popOptions);

    // EXECUTE QUERY
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;

    // SENDING RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
