const Validators = require('../validators/Validators');
const {success, fail, ErrorMap} = require('../../core/exception');
const Model = require('../models/VirusModel').getInstance();

const VirusCtrl = {

    async getAreaList(ctx) {
        const v = await new Validators.PageParamsValidator().validate(ctx);
        let page = v.get('query.page'), size = v.get('query.size');
        let list = await Model.getAreaList(page, size);
        if (list.length < 5) {
            const msg = 'fail. 失败了';
            Math.random() > 0.5 ? fail(ErrorMap.serverErr, msg) : fail(ErrorMap.clientErr, msg)
        }
        success(list)
    }

};

module.exports = VirusCtrl;
