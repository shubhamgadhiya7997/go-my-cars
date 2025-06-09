module.exports.getDataByPaginate = (req, keys) => {
    let aggregate_options = [];
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const options = {
        page,
        limit,
        collation: { locale: "en" },
    };

    let match = {};
    if (req.query.q && keys) match[keys] = { $regex: req.query.q, $options: "i" };

    aggregate_options.push({ $match: match });
  aggregate_options.push({ $sort: { createdAt: -1 } }); 

    return { aggregate_options, options };
};