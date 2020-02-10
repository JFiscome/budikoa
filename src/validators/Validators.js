const {LinValidator, Rule} = require('../../core/validatorHelper');

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super();
        this.id = [
            new Rule('isInt', '需要是正整数', {min: 1})
        ]
    }
}


class PageParamsValidator extends LinValidator {
    constructor() {
        super();
        this.page = [
            new Rule('isOptional', '', global.config.get('defaultParams.pageIndex')),
            new Rule('isInt', '必须为正整数', {min: 1})
        ];
        this.size = [
            new Rule('isOptional', '', global.config.get('defaultParams.pageSize')),
            new Rule('isInt', '介于1~20之间的整数', {min: 1, max: 20})
        ];
        this.id = [
            new Rule('isOptional'),
            new Rule('isInt', '必须为正整数', {min: 1})
        ]
    }
}


module.exports = {
    PositiveIntegerValidator,
    PageParamsValidator
};
