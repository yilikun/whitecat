var superagent = require('superagent'); 
var cheerio = require('cheerio');
var async = require('async');
console.log('�������ʼ����......');
// ��һ��������getData���󣬻�ȡ����4�ǽ�ɫ���б�
superagent
	.post('http://wcatproject.com/charSearch/function/getData.php')
	.send({ 
		// ����ı���ϢForm data
		info: 'isempty', 
		star : [0,0,0,1,0], 
		job : [0,0,0,0,0,0,0,0], 
		type : [0,0,0,0,0,0,0], 
		phase : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		cate : [0,0,0,0,0,0,0,0,0,0], 
		phases : ['����', '��һ��','�ڶ���','������','������','������','������', '������','�ڰ���','�ھ���','��ʮ��','��ʮһ��','��ʮ����','��ʮ����','��ʮ����', '��ʮ����', '��ʮ����'],
		cates : ['����޶�','�޶���ɫ','�}�Q�޶�','�����޶�','��؈�޶�','�д��޶�','�����޶�','�����޶�'] })
   	// Http�����Header��Ϣ
   .set('Accept', 'application/json, text/javascript, */*; q=0.01')
   .set('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
   .end(function(err, res){      	
    	// ���󷵻غ�Ĵ���
    	// ��response�з��صĽ��ת����JSON����
        var heroes = JSON.parse(res.text);    
        // ��������heroes����
		async.mapLimit(heroes, 1, 
			function (hero, callback) {
			// ��ÿ����ɫ����Ĵ����߼�
		 		var heroId = hero[0];	// ��ȡ��ɫ���ݵ�һλ�����ݣ�������ɫid
		    	fetchInfo(heroId, callback);
			}, 
			function (err, result) {
				console.log('ץȡ�Ľ�ɫ����' + heroes.length);
			}
		);
    }); 
// ��ȡ��ɫ��Ϣ
var concurrencyCount = 0; // ��ǰ��������¼
var fetchInfo = function(heroId, callback){
	concurrencyCount++;
	// console.log("...����ץȡ"+ heroId + "...��ǰ��������¼��" + concurrencyCount);
    // ���ݽ�ɫID��������ϸҳ�����ȡ�ͽ���
	superagent
    	.get('http://wcatproject.com/char/' + heroId)
    	.end(function(err, res){  
    		// ��ȡ�����Ľ�ɫ��ϸҳ������
    		var $ = cheerio.load(res.text,{decodeEntities: false});       			
    		// ��ҳ�����ݽ��н��������ռ��ӳ�����Ϊ��
    		console.log(heroId + '\t' + $('.leader-skill span').last().text())
	     	concurrencyCount--;
	    	callback(null, heroId);
    	});
	
};