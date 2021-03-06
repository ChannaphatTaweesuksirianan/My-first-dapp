App = {
      web3Provider: null,
      contracts: {},
      account: 0x0,

      init: function () {

            //     var articleRow = $('#articlesRow');
            //     var articleTemplate = $('#articleTemplate');

            //     articleTemplate.find('.panel-title').text('สินค้าชิ้นที่ 1');
            //     articleTemplate.find('.article-description').text('รายละเอียดสินค้าชิ้นที่ 1');
            //     articleTemplate.find('.article-price').text('10.24');
            //     articleTemplate.find('.article-seller').text('ซื้อผู้ขาย');

            //     articleRow.append(articleTemplate.html());

            return App.initWeb3();
      },

      initWeb3: function () {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');


            web3 = new Web3(App.web3Provider);

            App.displayAccountInfo();

            return App.initContract();
      },

      displayAccountInfo: function () {

            web3.eth.getCoinbase(function (err, balance) {
                  if (err === null) {
                        console.log("No error");

                        App.account = balance;
                        console.log(balance);
                        $('#account').text(balance);

                        web3.eth.getBalance(balance, function (err, balance) {
                              if (err === null) {
                                    console.log(balance, " Wei");
                                    var ether = web3.fromWei(balance, "ether");
                                    $("#accountBalance").text(ether + " Eth");
                              } else {
                                    console.log(err);
                              }

                        })

                  } else {
                        console.log(err);
                  }
            })

      },

      initContract: function () {
            $.getJSON('ChainList.json', function (chainListArtifact) {
                  App.contracts.ChainList = TruffleContract(chainListArtifact);
                  App.contracts.ChainList.setProvider(App.web3Provider);
                  return App.reloadArticles();
            });
      },

      reloadArticles: function () {
            App.displayAccountInfo();
            $('#articlesRow').empty();

            App.contracts.ChainList.deployed().then(function (instance) {
                  return instance.getArticle();
            }).then(function (article) {
                  console.log(article);

                  var articleRow = $('#articlesRow');
                  var articleTemplate = $('#articleTemplate');

                  articleTemplate.find('.panel-title').text(article[1]);
                  articleTemplate.find('.article-description').text(article[2]);
                  articleTemplate.find('.article-price').text(web3.fromWei(article[3], "ether"));

                  var seller = "";
                  if (article[0] == App.account) {
                        seller = "You";
                  } else {
                        seller = article
                  }
                  articleTemplate.find('.article-seller').text(seller);
                  articleRow.append(articleTemplate.html());
            });
      },

      sellArticle: function() {
            //ดึง artical ออกมาจาก web form
            var _article_name = $('#article_name').val();
            //ดึง description ออกมาจาก webform
            var _article_description = $('#article_description').val();
            //ดึงจำนวน ethereum ออกมาจาก web form และแปลงเป็น ค่า wei
            var _price = $('#article_price').val();
            var _article_price = web3.toWei(_price, "ether");

            // เรียก Smart Contract เอามาใช้ในชื่อ instance และสั่ง function sellArticle
            // กำหนด Address ผู้สั่งเป็น account ของเรา และกำหนดค่าแก๊ส
            App.contracts.ChainList.deployed().then(function(instance){
                  return instance.sellArticle(
                        _article_name,
                        _article_description,
                        _article_price,
                        { from: App.account, gas: 500000 }
                        );
            });      
      }.then(function(){
            App.reloadArticles();
      }).catch(function(err){
            console.error(err);
      }),

};

$(function () {
      $(window).load(function () {
            App.init();
      });
});