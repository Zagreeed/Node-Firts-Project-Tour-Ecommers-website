  class APIFeaturs {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }

    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);

      //ADVANCE FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      this.query = this.query.find(JSON.parse(queryStr));
      return this;
      //////////////////
    }

    sorting() {
      if (this.queryString.sort) {
        // const ctriteria = this.queryString.split(',').join(' ');
        const criteria = this.queryString.sort.split(',').join(' ');

        this.query = this.query.sort(criteria);
      } else {
        this.query = this.query.sort('-creatAt');
      }
      return this;
    }

    fieldLimit() {
      if (this.queryString.fields) {
        const fieldsss = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fieldsss);
        // console.log(query);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }

    pagenation() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skipp = (page - 1) * limit;

      this.query = this.query.skip(skipp).limit(limit);
      return this;
    }
  }

  module.exports = APIFeaturs;
