App = {
    web3Provider: null,
    contracts: {},

    init: function() {

        var articleRow = $('#articleRow');
        var articleTemplate = $('#articleTemplate');

        articleTemplate.find('.panel-title').text('สินค้าชิ้นที่ 1');
        articleTemplate.find('.article-description').text('รายละเอียดสินค้าชิ้นที่ 1');
        articleTemplate.find('.article-price').text('10.24');
        articleTemplate.find('.article-seller').text('ซื้อผู้ขาย');

        articleRow.append(articleTemplate.html());

        return App.initWeb3();
    },


}